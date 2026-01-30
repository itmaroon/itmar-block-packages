import { extends as _extends, objectSpread2 as _objectSpread2, asyncToGenerator as _asyncToGenerator } from './_virtual/_rollupPluginBabelHelpers.js';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { ComboboxControl, ToggleControl, CheckboxControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

//const _ = require("lodash");

var restFetchData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (path) {
    try {
      var ret_data = yield apiFetch({
        path: path
      });
      return ret_data;
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  });
  return function restFetchData(_x) {
    return _ref.apply(this, arguments);
  };
}();

//コンボボックスコントロールのレンダリング関数
var SelectControl = props => {
  var {
    selectedSlug,
    label,
    homeUrl,
    fetchOptions
  } = props;
  var [options, setOptions] = useState([]);
  useEffect(() => {
    var fetchData = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* () {
        try {
          var fetchedOptions = yield fetchOptions(homeUrl, props);
          setOptions(fetchedOptions);
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      });
      return function fetchData() {
        return _ref2.apply(this, arguments);
      };
    }();
    fetchData();
  }, [fetchOptions, homeUrl, props.restBase, props.status, props.perPage, props.orderby, props.order, props.search]);
  var selectedInfo = options.find(info => info.slug === selectedSlug);
  return /*#__PURE__*/React.createElement(ComboboxControl, {
    label: label,
    options: options,
    value: selectedInfo ? selectedInfo.value : -1,
    onChange: newValue => {
      var newInfo = options.find(info => info.value === newValue);
      props.onChange(newInfo);
    }
  });
};

//選択コントロールのレンダリング関数
var ChoiceControl = props => {
  var {
    selectedSlug,
    choiceItems,
    dispTaxonomies,
    type,
    blockMap,
    textDomain,
    fetchFunction
  } = props;
  var [choices, setChoices] = useState([]);
  useEffect(() => {
    if (!selectedSlug) return; //ポストタイプのスラッグが選択されていないときは処理終了
    var fetchData = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(function* () {
        try {
          var fetchChoices = yield fetchFunction(selectedSlug);
          setChoices(fetchChoices);
          //指定の投稿タイプに含まれないフィールドを削除する
          pruneChoiceItemsByObjectKeys(fetchChoices[0], choiceItems);
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      });
      return function fetchData() {
        return _ref3.apply(this, arguments);
      };
    }();
    fetchData();
  }, [selectedSlug, fetchFunction]);

  //選択肢が変わったときに選択されている項目の配列内容を更新するハンドラ
  var handleChoiceChange = (checked, target, setItems) => {
    if (checked) {
      // targetが重複していない場合のみ追加
      if (!setItems.some(item => _.isEqual(item, target))) {
        return [...setItems, target];
      }
    } else {
      // targetを配列から削除
      return setItems.filter(item => !_.isEqual(item, target));
    }
    return setItems;
  };
  /**
   * dataObj のキー一覧を「choiceItems と比較する形」に変換して Set で返す
   * - 通常キー: そのまま
   * - acf / meta: 子キーに `${parent}_` を付けたもの（例: acf_relate_url, meta_footnotes）
   */
  function buildComparableKeySet(dataObj) {
    var keySet = new Set();
    if (!dataObj || typeof dataObj !== "object") return keySet;
    for (var [key, val] of Object.entries(dataObj)) {
      if ((key === "acf" || key === "meta") && val && typeof val === "object" && !Array.isArray(val)) {
        for (var childKey of Object.keys(val)) {
          keySet.add("".concat(key, "_").concat(childKey));
        }
        continue;
      }
      keySet.add(key);
    }
    return keySet;
  }

  /**
   * choiceItems を dataObj のキーに合わせて削除する
   * - choiceItems が string 配列でも、{value: "..."} の配列でも動くようにしてあります
   */
  function pruneChoiceItemsByObjectKeys(dataObj, choiceItems) {
    var validKeys = buildComparableKeySet(dataObj);
    var getItemKey = item => {
      var _ref4, _ref5, _item$value;
      if (typeof item === "string") return item;
      if (item && typeof item === "object") return (_ref4 = (_ref5 = (_item$value = item.value) !== null && _item$value !== void 0 ? _item$value : item.key) !== null && _ref5 !== void 0 ? _ref5 : item.name) !== null && _ref4 !== void 0 ? _ref4 : "";
      return "";
    };
    var next = (choiceItems !== null && choiceItems !== void 0 ? choiceItems : []).filter(item => validKeys.has(getItemKey(item)));

    // ★ 配列の参照はそのまま、中身だけ置き換える
    choiceItems.splice(0, choiceItems.length, ...next);
    return choiceItems; // 必要なら返す
  }
  var _dispCustumFields = function dispCustumFields(obj) {
    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var isImage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var onChange = arguments.length > 3 ? arguments[3] : undefined;
    return Object.entries(obj).map(_ref6 => {
      var [key, value] = _ref6;
      var fieldName = prefix ? "".concat(prefix, ".").concat(key) : key; //prefixはグループ名

      var fieldLabel = key.replace(/^(meta_|acf_)/, "");
      //オブジェクトであって配列でないものがグループと考える
      if (typeof value === "object" && !Array.isArray(value) && value !== null) {
        return /*#__PURE__*/React.createElement("div", {
          className: "group_area"
        }, /*#__PURE__*/React.createElement("div", {
          className: "group_label"
        }, fieldLabel), /*#__PURE__*/React.createElement("div", {
          key: fieldName,
          className: "field_group"
        }, _dispCustumFields(value, fieldName, isImage, onChange)));
      } else {
        if (key === "meta__acf_changed" || key === "meta_footnotes") return; //_acf_changedは対象外

        //フィールドを表示するブロックの選択肢
        var options = [{
          value: "itmar/design-title",
          label: "itmar/design-title"
        }, {
          value: "core/paragraph",
          label: "core/paragraph"
        }, {
          value: "core/image",
          label: "core/image"
        }, {
          value: "itmar/slide-mv",
          label: "itmar/slide-mv"
        }];
        return /*#__PURE__*/React.createElement("div", {
          className: "itmar_custom_field_set"
        }, /*#__PURE__*/React.createElement(ToggleControl, {
          key: fieldName,
          className: "field_choice",
          label: fieldLabel,
          checked: choiceItems.some(choiceField => choiceField === fieldName),
          onChange: checked => {
            var newChoiceFields = handleChoiceChange(checked, fieldName, choiceItems);
            props.onChange(newChoiceFields);
          }
        }), !isImage && /*#__PURE__*/React.createElement(ComboboxControl, {
          options: options,
          value:
          //blockMap[`${prefix ? groupLabel : ""}${key}`] || "itmar/design-title"
          blockMap["".concat(prefix ? prefix + "." : "").concat(key)] || "itmar/design-title",
          onChange: newValue => {
            //const fieldKey = prefix ? `${groupLabel}${key}` : `${key}`;
            var fieldKey = prefix ? "".concat(prefix, ".").concat(key) : "".concat(key);
            var newBlockMap = _objectSpread2(_objectSpread2({}, blockMap), {}, {
              [fieldKey]: newValue
            });
            props.onBlockMapChange(newBlockMap);
          }
        }));
      }
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "".concat(type, "_section")
  }, type === "taxonomy" && choices.map((choice, index) => {
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "term_section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tax_label"
    }, choice.name, /*#__PURE__*/React.createElement(ToggleControl, {
      label: __("Display", "block-collections"),
      checked: dispTaxonomies.some(tax => tax === choice.slug),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, choice.slug, dispTaxonomies);
        props.onSetDispTax(newChoiceFields);
      }
    })), choice.terms.map((term, index) => {
      return /*#__PURE__*/React.createElement(CheckboxControl, {
        className: "term_check",
        key: index,
        label: term.name,
        checked: choiceItems.some(choiceTerm => {
          return choiceTerm.taxonomy === choice.slug && choiceTerm.term.id === term.id;
        }),
        onChange: checked => {
          var target = {
            taxonomy: choice.slug,
            term: {
              id: term.id,
              slug: term.slug,
              name: term.name
            }
          };
          var newChoiceTerms = handleChoiceChange(checked, target, choiceItems);
          props.onChange(newChoiceTerms);
        }
      });
    }));
  }), type === "field" && choices.map((choice, index) => {
    //metaの対象カスタムフィールドが含まれるかのフラグ
    var metaFlg = choice.meta && !Object.keys(choice.meta).every(key => key === "_acf_changed" || key === "footnotes");
    //acfの対象カスタムフィールドが含まれるかのフラグ
    var acfFlg = choice.acf && typeof choice.acf === "object" && !Array.isArray(choice.acf);
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "field_section"
    }, choice.title && /*#__PURE__*/React.createElement(ToggleControl, {
      className: "field_choice",
      label: __("Title", "block-collections"),
      checked: choiceItems.some(choiceField => choiceField === "title"),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, "title", choiceItems);
        props.onChange(newChoiceFields);
      }
    }), choice.content && /*#__PURE__*/React.createElement(ToggleControl, {
      className: "field_choice",
      label: __("Content", "block-collections"),
      checked: choiceItems.some(choiceField => choiceField === "content"),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, "content", choiceItems);
        props.onChange(newChoiceFields);
      }
    }), choice.date && /*#__PURE__*/React.createElement(ToggleControl, {
      className: "field_choice",
      label: __("Date", "block-collections"),
      checked: choiceItems.some(choiceField => choiceField === "date"),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, "date", choiceItems);
        props.onChange(newChoiceFields);
      }
    }), choice.excerpt && /*#__PURE__*/React.createElement(ToggleControl, {
      className: "field_choice",
      label: __("Excerpt", "block-collections"),
      checked: choiceItems.some(choiceField => choiceField === "excerpt"),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, "excerpt", choiceItems);
        props.onChange(newChoiceFields);
      }
    }), (choice.featured_media || choice.featured_media === 0) && /*#__PURE__*/React.createElement(ToggleControl, {
      className: "field_choice",
      label: __("Featured Image", "block-collections"),
      checked: choiceItems.some(choiceField => choiceField === "featured_media"),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, "featured_media", choiceItems);
        props.onChange(newChoiceFields);
      }
    }), choice.link && /*#__PURE__*/React.createElement("div", {
      className: "itmar_custom_field_set"
    }, /*#__PURE__*/React.createElement(ToggleControl, {
      className: "field_choice",
      label: __("Single Page Link", "block-collections"),
      checked: choiceItems.some(choiceField => choiceField === "link"),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, "link", choiceItems);
        props.onChange(newChoiceFields);
      }
    }), /*#__PURE__*/React.createElement(ComboboxControl, {
      options: [{
        value: "itmar/design-button",
        label: "itmar/design-button"
      }, {
        value: "itmar/design-title",
        label: "itmar/design-title"
      }],
      value: blockMap["link"],
      onChange: newValue => {
        var newBlockMap = _objectSpread2(_objectSpread2({}, blockMap), {}, {
          link: newValue
        });
        props.onBlockMapChange(newBlockMap);
      }
    }), /*#__PURE__*/React.createElement("p", null, __("If no block is specified, a link will be set to the parent block, Design Group.", "block-collections"))), (metaFlg || acfFlg) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "custom_field_label"
    }, __("Custom Field", "block-collections")), /*#__PURE__*/React.createElement("div", {
      className: "custom_field_area"
    }, _dispCustumFields(_objectSpread2(_objectSpread2({}, Object.entries(choice.meta).reduce((acc, _ref7) => {
      var [key, value] = _ref7;
      return _objectSpread2(_objectSpread2({}, acc), {}, {
        ["meta_".concat(key)]: value
      });
    }, {})), Object.entries(choice.acf).filter(_ref8 => {
      var [key] = _ref8;
      return !key.endsWith("_source");
    }).reduce((acc, _ref9) => {
      var [key, value] = _ref9;
      return _objectSpread2(_objectSpread2({}, acc), {}, {
        ["acf_".concat(key)]: value
      });
    }, {}))))));
  }), type === "imgField" && choices.map((choice, index) => {
    //metaの対象カスタムフィールドが含まれるかのフラグ
    var metaFlg = choice.meta && !Object.keys(choice.meta).every(key => key === "_acf_changed" || key === "footnotes");
    //acfの対象カスタムフィールドが含まれるかのフラグ
    var acfFlg = choice.acf && typeof choice.acf === "object" && !Array.isArray(choice.acf);
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: "field_section"
    }, choice.content && /*#__PURE__*/React.createElement(ToggleControl, {
      className: "field_choice",
      label: __("Content", "block-collections"),
      checked: choiceItems.some(choiceField => choiceField === "content"),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, "content", choiceItems);
        props.onChange(newChoiceFields);
      }
    }), (choice.featured_media || choice.featured_media === 0) && /*#__PURE__*/React.createElement(ToggleControl, {
      className: "field_choice",
      label: __("Featured Image", "block-collections"),
      checked: choiceItems.some(choiceField => choiceField === "featured_media"),
      onChange: checked => {
        var newChoiceFields = handleChoiceChange(checked, "featured_media", choiceItems);
        props.onChange(newChoiceFields);
      }
    }), (metaFlg || acfFlg) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "custom_field_label"
    }, __("Custom Field", "block-collections")), /*#__PURE__*/React.createElement("div", {
      className: "custom_field_area"
    }, _dispCustumFields(_objectSpread2(_objectSpread2({}, Object.entries(choice.meta).reduce((acc, _ref0) => {
      var [key, value] = _ref0;
      return _objectSpread2(_objectSpread2({}, acc), {}, {
        ["meta_".concat(key)]: value
      });
    }, {})), Object.entries(choice.acf).filter(_ref1 => {
      var [key] = _ref1;
      return !key.endsWith("_source");
    }).reduce((acc, _ref10) => {
      var [key, value] = _ref10;
      return _objectSpread2(_objectSpread2({}, acc), {}, {
        ["acf_".concat(key)]: value
      });
    }, {})), "", true))));
  }));
};

//固定ページ取得RestAPI関数
var fetchPagesOptions = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(function* (home_url) {
    var allPages = [];
    var page = 1;
    while (true) {
      var items = yield apiFetch({
        path: addQueryArgs("/wp/v2/pages", {
          status: "publish",
          // 公開のみ
          per_page: 100,
          // 最大100
          page
          // orderby: "title",
          // order: "asc",
        })
      });
      allPages.push(...items);

      // 100件未満ならこれが最後
      if (!items || items.length < 100) break;
      page++;
    }

    // ページIDが-1である要素をホーム要素として作成
    if (!allPages.some(p => p.id === -1)) {
      allPages.unshift({
        id: -1,
        title: {
          rendered: "ホーム"
        },
        link: home_url,
        slug: ""
      });
    }
    var ret_pages = allPages.map(p => {
      var _p$title$rendered, _p$title;
      return {
        value: p.id,
        slug: p.slug,
        label: (_p$title$rendered = (_p$title = p.title) === null || _p$title === void 0 ? void 0 : _p$title.rendered) !== null && _p$title$rendered !== void 0 ? _p$title$rendered : "",
        // 階層ページでも正しいURLになるようにRESTのlinkを優先
        link: p.link || (p.slug ? "".concat(home_url, "/").concat(p.slug) : home_url)
      };
    });
    return ret_pages;
  });
  return function fetchPagesOptions(_x2) {
    return _ref11.apply(this, arguments);
  };
}();

//アーカイブ情報取得RestAPI関数
var fetchArchiveOptions = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(function* (home_url) {
    var response = yield apiFetch({
      path: "/wp/v2/types"
    });
    var idCounter = 0;
    return Object.keys(response).reduce((acc, key) => {
      var postType = response[key];
      if (postType.has_archive === true) {
        acc.push({
          value: idCounter++,
          slug: postType.slug,
          rest_base: postType.rest_base,
          link: "".concat(home_url, "/").concat(postType.slug),
          label: postType.name
        });
      } else if (typeof postType.has_archive === "string") {
        //アーカイブ名がついているとき
        acc.push({
          value: idCounter++,
          slug: postType.slug,
          rest_base: postType.rest_base,
          link: "".concat(home_url, "/").concat(postType.has_archive),
          label: postType.name
        });
      }
      return acc;
    }, []);
  });
  return function fetchArchiveOptions(_x3) {
    return _ref12.apply(this, arguments);
  };
}();
//投稿データ取得RestAPI関数
var fetchPostOptions = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(function* (home_url) {
    var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var perPage = Math.min(Number(props.perPage || 100), 100);
    var status = props.status || "publish"; // 管理画面で下書き等も含めたいなら 'any' を検討
    var orderby = props.orderby || "title";
    var order = props.order || "asc";
    var search = props.search ? String(args.search) : "";
    var restBase = props.restBase || "";
    var allPosts = [];
    var maxPagesSafety = 50; // 念のための安全上限

    for (var page = 1; page <= maxPagesSafety; page++) {
      var params = new URLSearchParams();
      params.set("per_page", String(perPage));
      params.set("page", String(page));
      params.set("status", status);
      params.set("orderby", orderby);
      params.set("order", order);
      // 必要なフィールドだけ返して軽量化
      params.set("_fields", "id,slug,title,link");
      if (search) params.set("search", search);
      var path = "/wp/v2/".concat(encodeURIComponent(restBase), "?").concat(params.toString());
      var posts = yield apiFetch({
        path
      });
      if (!Array.isArray(posts) || posts.length === 0) break;
      allPosts.push(...posts);

      // これ以上ページがない（=最終ページ）と判断
      if (posts.length < perPage) break;
    }

    // title.rendered はHTMLを含むことがあるのでタグを除去
    var stripTags = html => String(html || "").replace(/<[^>]*>/g, "").trim();
    return allPosts.map(post => {
      var _post$title;
      var title = stripTags(post === null || post === void 0 || (_post$title = post.title) === null || _post$title === void 0 ? void 0 : _post$title.rendered) || "(no title)";
      return {
        value: Number(post.id),
        // ComboboxControl の value
        label: title,
        // ComboboxControl の表示文字
        slug: post.slug,
        // あなたの SelectControl が selectedSlug と照合するキー
        link: post.link || "".concat(home_url, "/?p=").concat(post.id),
        rest_base: restBase,
        post_id: Number(post.id)
      };
    });
  });
  return function fetchPostOptions(_x4) {
    return _ref13.apply(this, arguments);
  };
}();

//タクソノミー取得RestAPI関数
var restTaxonomies = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(function* (post_type) {
    if (!post_type) return;
    var response = yield apiFetch({
      path: "/wp/v2/types/".concat(post_type, "?context=edit")
    });
    var taxonomies = response.taxonomies;
    var taxonomyPromises = taxonomies.map(/*#__PURE__*/function () {
      var _ref15 = _asyncToGenerator(function* (slug) {
        var taxonomyResponse = yield apiFetch({
          path: "/wp/v2/taxonomies/".concat(slug, "?context=edit")
        });
        var terms = yield apiFetch({
          path: "/wp/v2/".concat(taxonomyResponse.rest_base)
        });
        return {
          slug: slug,
          name: taxonomyResponse.name,
          rest_base: taxonomyResponse.rest_base,
          terms: terms
        };
      });
      return function (_x6) {
        return _ref15.apply(this, arguments);
      };
    }());
    var taxonomyObjects = yield Promise.all(taxonomyPromises);
    return taxonomyObjects;
  });
  return function restTaxonomies(_x5) {
    return _ref14.apply(this, arguments);
  };
}();

//タームの文字列化
var termToDispObj = (terms, connectString) => {
  // taxonomyごとにterm.nameをまとめる
  var result = terms.reduce((acc, item) => {
    var taxonomy = item.taxonomy;
    var termName = item.term.name;

    // taxonomyがまだ存在しない場合は初期化
    if (!acc[taxonomy]) {
      acc[taxonomy] = [];
    }

    // term.nameを配列に追加
    acc[taxonomy].push(termName);
    return acc;
  }, {});

  // 各taxonomyの配列を connectString でつなげて文字列化
  for (var taxonomy in result) {
    result[taxonomy] = result[taxonomy].join(connectString);
  }
  return result;
};

//フィールド情報取得RestAPI関数
var restFieldes = /*#__PURE__*/function () {
  var _ref16 = _asyncToGenerator(function* (rest_base) {
    //投稿データに以下のフィールドが含まれているかを調べる
    var selectedFields = ["title", "content", "date", "excerpt", "featured_media", "link", "meta", "acf"];
    var fieldsParam = selectedFields.join(",");
    //最新の投稿データから１件分のデータを抽出
    var response = yield apiFetch({
      path: "/wp/v2/".concat(rest_base, "?_fields=").concat(fieldsParam, "&per_page=1&order=desc")
    });
    return response;
  });
  return function restFieldes(_x7) {
    return _ref16.apply(this, arguments);
  };
}();
var PageSelectControl = props => /*#__PURE__*/React.createElement(SelectControl, _extends({}, props, {
  fetchOptions: fetchPagesOptions
}));
var ArchiveSelectControl = props => /*#__PURE__*/React.createElement(SelectControl, _extends({}, props, {
  fetchOptions: fetchArchiveOptions
}));
var PostSelectControl = props => /*#__PURE__*/React.createElement(SelectControl, _extends({}, props, {
  fetchOptions: fetchPostOptions
}));
var TermChoiceControl = props => /*#__PURE__*/React.createElement(ChoiceControl, _extends({}, props, {
  fetchFunction: restTaxonomies
}));
var FieldChoiceControl = props => /*#__PURE__*/React.createElement(ChoiceControl, _extends({}, props, {
  fetchFunction: restFieldes
}));

export { ArchiveSelectControl, FieldChoiceControl, PageSelectControl, PostSelectControl, TermChoiceControl, fetchArchiveOptions, fetchPagesOptions, fetchPostOptions, restFetchData, restFieldes, restTaxonomies, termToDispObj };
//# sourceMappingURL=wordpressApi.js.map
