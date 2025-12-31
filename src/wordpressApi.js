import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  ComboboxControl,
  CheckboxControl,
  ToggleControl,
} from "@wordpress/components";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

//const _ = require("lodash");

export const restFetchData = async (path) => {
  try {
    const ret_data = await apiFetch({ path: path });
    return ret_data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
};

//コンボボックスコントロールのレンダリング関数
const SelectControl = (props) => {
  const { selectedSlug, label, homeUrl, fetchOptions } = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOptions = await fetchOptions(homeUrl);
        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [fetchOptions]);

  const selectedInfo = options.find((info) => info.slug === selectedSlug);
  return (
    <ComboboxControl
      label={label}
      options={options}
      value={selectedInfo ? selectedInfo.value : -1}
      onChange={(newValue) => {
        const newInfo = options.find((info) => info.value === newValue);
        props.onChange(newInfo);
      }}
    />
  );
};

//選択コントロールのレンダリング関数
const ChoiceControl = (props) => {
  const {
    selectedSlug,
    choiceItems,
    dispTaxonomies,
    type,
    blockMap,
    textDomain,
    fetchFunction,
  } = props;

  const [choices, setChoices] = useState([]);
  useEffect(() => {
    if (!selectedSlug) return; //ポストタイプのスラッグが選択されていないときは処理終了
    const fetchData = async () => {
      try {
        const fetchChoices = await fetchFunction(selectedSlug);
        setChoices(fetchChoices);
        //指定の投稿タイプに含まれないフィールドを削除する
        pruneChoiceItemsByObjectKeys(fetchChoices[0], choiceItems);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, [selectedSlug, fetchFunction]);

  //選択肢が変わったときに選択されている項目の配列内容を更新するハンドラ
  const handleChoiceChange = (checked, target, setItems) => {
    if (checked) {
      // targetが重複していない場合のみ追加
      if (!setItems.some((item) => _.isEqual(item, target))) {
        return [...setItems, target];
      }
    } else {
      // targetを配列から削除
      return setItems.filter((item) => !_.isEqual(item, target));
    }
    return setItems;
  };
  /**
   * dataObj のキー一覧を「choiceItems と比較する形」に変換して Set で返す
   * - 通常キー: そのまま
   * - acf / meta: 子キーに `${parent}_` を付けたもの（例: acf_relate_url, meta_footnotes）
   */
  function buildComparableKeySet(dataObj) {
    const keySet = new Set();

    if (!dataObj || typeof dataObj !== "object") return keySet;

    for (const [key, val] of Object.entries(dataObj)) {
      if (
        (key === "acf" || key === "meta") &&
        val &&
        typeof val === "object" &&
        !Array.isArray(val)
      ) {
        for (const childKey of Object.keys(val)) {
          keySet.add(`${key}_${childKey}`);
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
    const validKeys = buildComparableKeySet(dataObj);

    const getItemKey = (item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object")
        return item.value ?? item.key ?? item.name ?? "";
      return "";
    };

    const next = (choiceItems ?? []).filter((item) =>
      validKeys.has(getItemKey(item))
    );

    // ★ 配列の参照はそのまま、中身だけ置き換える
    choiceItems.splice(0, choiceItems.length, ...next);

    return choiceItems; // 必要なら返す
  }

  //階層化されたカスタムフィールドのフィールド名を表示する関数
  let groupLabel = "";
  const dispCustumFields = (obj, prefix = "", isImage = false, onChange) => {
    return Object.entries(obj).map(([key, value]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key; //prefixはグループ名

      const fieldLabel = key.replace(/^(meta_|acf_)/, "");
      //オブジェクトであって配列でないものがグループと考える
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        groupLabel = `${fieldLabel}.`;
        return (
          <div className="group_area">
            <div className="group_label">{fieldLabel}</div>
            <div key={fieldName} className="field_group">
              {dispCustumFields(value, fieldName, isImage, onChange)}
            </div>
          </div>
        );
      } else {
        if (key === "meta__acf_changed" || key === "meta_footnotes") return; //_acf_changedは対象外

        //フィールドを表示するブロックの選択肢
        const options = [
          { value: "itmar/design-title", label: "itmar/design-title" },
          { value: "core/paragraph", label: "core/paragraph" },
          { value: "core/image", label: "core/image" },
          { value: "itmar/slide-mv", label: "itmar/slide-mv" },
        ];
        return (
          <div className="itmar_custom_field_set">
            <ToggleControl
              key={fieldName}
              className="field_choice"
              label={fieldLabel}
              checked={choiceItems.some(
                (choiceField) => choiceField === fieldName
              )}
              onChange={(checked) => {
                const newChoiceFields = handleChoiceChange(
                  checked,
                  fieldName,
                  choiceItems
                );
                props.onChange(newChoiceFields);
              }}
            />
            {!isImage && (
              <ComboboxControl
                options={options}
                value={
                  //blockMap[`${prefix ? groupLabel : ""}${key}`] || "itmar/design-title"
                  blockMap[`${prefix ? prefix + "." : ""}${key}`] ||
                  "itmar/design-title"
                }
                onChange={(newValue) => {
                  //const fieldKey = prefix ? `${groupLabel}${key}` : `${key}`;
                  const fieldKey = prefix ? `${prefix}.${key}` : `${key}`;

                  const newBlockMap = { ...blockMap, [fieldKey]: newValue };
                  props.onBlockMapChange(newBlockMap);
                }}
              />
            )}
          </div>
        );
      }
    });
  };

  return (
    <div className={`${type}_section`}>
      {type === "taxonomy" &&
        choices.map((choice, index) => {
          return (
            <div key={index} className="term_section">
              <div className="tax_label">
                {choice.name}
                <ToggleControl
                  label={__("Display", "block-collections")}
                  checked={dispTaxonomies.some((tax) => tax === choice.slug)}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      choice.slug,
                      dispTaxonomies
                    );
                    props.onSetDispTax(newChoiceFields);
                  }}
                />
              </div>
              {choice.terms.map((term, index) => {
                return (
                  <CheckboxControl
                    className="term_check"
                    key={index}
                    label={term.name}
                    checked={choiceItems.some((choiceTerm) => {
                      return (
                        choiceTerm.taxonomy === choice.slug &&
                        choiceTerm.term.id === term.id
                      );
                    })}
                    onChange={(checked) => {
                      const target = {
                        taxonomy: choice.slug,
                        term: { id: term.id, slug: term.slug, name: term.name },
                      };
                      const newChoiceTerms = handleChoiceChange(
                        checked,
                        target,
                        choiceItems
                      );
                      props.onChange(newChoiceTerms);
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      {type === "field" &&
        choices.map((choice, index) => {
          //metaの対象カスタムフィールドが含まれるかのフラグ
          const metaFlg =
            choice.meta &&
            !Object.keys(choice.meta).every(
              (key) => key === "_acf_changed" || key === "footnotes"
            );
          //acfの対象カスタムフィールドが含まれるかのフラグ
          const acfFlg =
            choice.acf &&
            typeof choice.acf === "object" &&
            !Array.isArray(choice.acf);

          return (
            <div key={index} className="field_section">
              {choice.title && (
                <ToggleControl
                  className="field_choice"
                  label={__("Title", "block-collections")}
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "title"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "title",
                      choiceItems
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {choice.content && (
                <ToggleControl
                  className="field_choice"
                  label={__("Content", "block-collections")}
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "content"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "content",
                      choiceItems
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {choice.date && (
                <ToggleControl
                  className="field_choice"
                  label={__("Date", "block-collections")}
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "date"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "date",
                      choiceItems
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {choice.excerpt && (
                <ToggleControl
                  className="field_choice"
                  label={__("Excerpt", "block-collections")}
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "excerpt"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "excerpt",
                      choiceItems
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {(choice.featured_media || choice.featured_media === 0) && (
                <ToggleControl
                  className="field_choice"
                  label={__("Featured Image", "block-collections")}
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "featured_media"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "featured_media",
                      choiceItems
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {choice.link && (
                <div className="itmar_custom_field_set">
                  <ToggleControl
                    className="field_choice"
                    label={__("Single Page Link", "block-collections")}
                    checked={choiceItems.some(
                      (choiceField) => choiceField === "link"
                    )}
                    onChange={(checked) => {
                      const newChoiceFields = handleChoiceChange(
                        checked,
                        "link",
                        choiceItems
                      );
                      props.onChange(newChoiceFields);
                    }}
                  />
                  <ComboboxControl
                    options={[
                      {
                        value: "itmar/design-button",
                        label: "itmar/design-button",
                      },
                      {
                        value: "itmar/design-title",
                        label: "itmar/design-title",
                      },
                    ]}
                    value={blockMap["link"]}
                    onChange={(newValue) => {
                      const newBlockMap = {
                        ...blockMap,
                        link: newValue,
                      };
                      props.onBlockMapChange(newBlockMap);
                    }}
                  />
                  <p>
                    {__(
                      "If no block is specified, a link will be set to the parent block, Design Group.",
                      "block-collections"
                    )}
                  </p>
                </div>
              )}
              {(metaFlg || acfFlg) && (
                <>
                  <div className="custom_field_label">
                    {__("Custom Field", "block-collections")}
                  </div>
                  <div className="custom_field_area">
                    {dispCustumFields({
                      // meta はそのまま
                      ...Object.entries(choice.meta).reduce(
                        (acc, [key, value]) => ({
                          ...acc,
                          [`meta_${key}`]: value,
                        }),
                        {}
                      ),
                      // acf は「同名で _source があるもののベース側を除く」
                      ...Object.entries(choice.acf)
                        .filter(([key]) => !key.endsWith("_source"))
                        .reduce(
                          (acc, [key, value]) => ({
                            ...acc,
                            [`acf_${key}`]: value,
                          }),
                          {}
                        ),
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      {type === "imgField" &&
        choices.map((choice, index) => {
          //metaの対象カスタムフィールドが含まれるかのフラグ
          const metaFlg =
            choice.meta &&
            !Object.keys(choice.meta).every(
              (key) => key === "_acf_changed" || key === "footnotes"
            );
          //acfの対象カスタムフィールドが含まれるかのフラグ
          const acfFlg =
            choice.acf &&
            typeof choice.acf === "object" &&
            !Array.isArray(choice.acf);

          return (
            <div key={index} className="field_section">
              {choice.content && (
                <ToggleControl
                  className="field_choice"
                  label={__("Content", "block-collections")}
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "content"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "content",
                      choiceItems
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {(choice.featured_media || choice.featured_media === 0) && (
                <ToggleControl
                  className="field_choice"
                  label={__("Featured Image", "block-collections")}
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "featured_media"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "featured_media",
                      choiceItems
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}

              {(metaFlg || acfFlg) && (
                <>
                  <div className="custom_field_label">
                    {__("Custom Field", "block-collections")}
                  </div>
                  <div className="custom_field_area">
                    {dispCustumFields(
                      {
                        // meta はそのまま
                        ...Object.entries(choice.meta).reduce(
                          (acc, [key, value]) => ({
                            ...acc,
                            [`meta_${key}`]: value,
                          }),
                          {}
                        ),
                        // acf は「同名で _source があるもののベース側を除く」
                        ...Object.entries(choice.acf)
                          .filter(([key]) => !key.endsWith("_source"))
                          .reduce(
                            (acc, [key, value]) => ({
                              ...acc,
                              [`acf_${key}`]: value,
                            }),
                            {}
                          ),
                      },
                      "",
                      true
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};

//固定ページ取得RestAPI関数
export const fetchPagesOptions = async (home_url) => {
  const allPages = [];
  let page = 1;

  while (true) {
    const items = await apiFetch({
      path: addQueryArgs("/wp/v2/pages", {
        status: "publish", // 公開のみ
        per_page: 100, // 最大100
        page,
        // orderby: "title",
        // order: "asc",
      }),
    });

    allPages.push(...items);

    // 100件未満ならこれが最後
    if (!items || items.length < 100) break;

    page++;
  }

  // ページIDが-1である要素をホーム要素として作成
  if (!allPages.some((p) => p.id === -1)) {
    allPages.unshift({
      id: -1,
      title: { rendered: "ホーム" },
      link: home_url,
      slug: "",
    });
  }

  const ret_pages = allPages.map((p) => ({
    value: p.id,
    slug: p.slug,
    label: p.title?.rendered ?? "",
    // 階層ページでも正しいURLになるようにRESTのlinkを優先
    link: p.link || (p.slug ? `${home_url}/${p.slug}` : home_url),
  }));

  return ret_pages;
};

//アーカイブ情報取得RestAPI関数
export const fetchArchiveOptions = async (home_url) => {
  const response = await apiFetch({ path: "/wp/v2/types" });

  let idCounter = 0;
  return Object.keys(response).reduce((acc, key) => {
    const postType = response[key];
    if (postType.has_archive === true) {
      acc.push({
        value: idCounter++,
        slug: postType.slug,
        rest_base: postType.rest_base,
        link: `${home_url}/${postType.slug}`,
        label: postType.name,
      });
    } else if (typeof postType.has_archive === "string") {
      //アーカイブ名がついているとき
      acc.push({
        value: idCounter++,
        slug: postType.slug,
        rest_base: postType.rest_base,
        link: `${home_url}/${postType.has_archive}`,
        label: postType.name,
      });
    }
    return acc;
  }, []);
};

//タクソノミー取得RestAPI関数
export const restTaxonomies = async (post_type) => {
  if (!post_type) return;

  const response = await apiFetch({
    path: `/wp/v2/types/${post_type}?context=edit`,
  });

  const taxonomies = response.taxonomies;

  const taxonomyPromises = taxonomies.map(async (slug) => {
    const taxonomyResponse = await apiFetch({
      path: `/wp/v2/taxonomies/${slug}?context=edit`,
    });
    const terms = await apiFetch({
      path: `/wp/v2/${taxonomyResponse.rest_base}`,
    });

    return {
      slug: slug,
      name: taxonomyResponse.name,
      rest_base: taxonomyResponse.rest_base,
      terms: terms,
    };
  });

  const taxonomyObjects = await Promise.all(taxonomyPromises);
  return taxonomyObjects;
};

//タームの文字列化
export const termToDispObj = (terms, connectString) => {
  // taxonomyごとにterm.nameをまとめる
  const result = terms.reduce((acc, item) => {
    const taxonomy = item.taxonomy;
    const termName = item.term.name;

    // taxonomyがまだ存在しない場合は初期化
    if (!acc[taxonomy]) {
      acc[taxonomy] = [];
    }

    // term.nameを配列に追加
    acc[taxonomy].push(termName);

    return acc;
  }, {});

  // 各taxonomyの配列を connectString でつなげて文字列化
  for (const taxonomy in result) {
    result[taxonomy] = result[taxonomy].join(connectString);
  }

  return result;
};

//フィールド情報取得RestAPI関数
export const restFieldes = async (rest_base) => {
  //投稿データに以下のフィールドが含まれているかを調べる
  const selectedFields = [
    "title",
    "content",
    "date",
    "excerpt",
    "featured_media",
    "link",
    "meta",
    "acf",
  ];
  const fieldsParam = selectedFields.join(",");
  //最新の投稿データから１件分のデータを抽出
  const response = await apiFetch({
    path: `/wp/v2/${rest_base}?_fields=${fieldsParam}&per_page=1&order=desc`,
  });

  return response;
};

export const PageSelectControl = (props) => (
  <SelectControl {...props} fetchOptions={fetchPagesOptions} />
);

export const ArchiveSelectControl = (props) => (
  <SelectControl {...props} fetchOptions={fetchArchiveOptions} />
);

export const TermChoiceControl = (props) => (
  <ChoiceControl {...props} fetchFunction={restTaxonomies} />
);

export const FieldChoiceControl = (props) => (
  <ChoiceControl {...props} fetchFunction={restFieldes} />
);
