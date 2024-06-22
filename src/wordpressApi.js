import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  ComboboxControl,
  CheckboxControl,
  ToggleControl,
} from "@wordpress/components";
import apiFetch from "@wordpress/api-fetch";

//const _ = require("lodash");

export const fetchData = async (rest_api) => {
  try {
    const ret_data = await rest_api();
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
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, [selectedSlug, fetchFunction]);

  //選択肢が変わったときに選択されている項目の配列内容を更新するハンドラ
  const handleChoiceChange = (checked, target) => {
    if (checked) {
      // targetが重複していない場合のみ追加
      if (!choiceItems.some((item) => _.isEqual(item, target))) {
        return [...choiceItems, target];
      }
    } else {
      // targetを配列から削除
      return choiceItems.filter((item) => !_.isEqual(item, target));
    }
    return choiceItems;
  };

  //階層化されたカスタムフィールドのフィールド名を表示する関数
  const dispCustumFields = (obj, prefix = "", onChange) => {
    return Object.entries(obj).map(([key, value]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key;
      const fieldLabel = key.replace(/^(meta_|acf_)/, "");
      if (typeof value === "object" && value !== null) {
        return (
          <div className="group_area">
            <div className="group_label">{fieldLabel}</div>
            <div key={fieldName} className="field_group">
              {dispCustumFields(value, fieldName, onChange)}
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
                const newChoiceFields = handleChoiceChange(checked, fieldName);
                props.onChange(newChoiceFields);
              }}
            />
            <ComboboxControl
              options={options}
              value={blockMap[fieldLabel] || "itmar/design-title"}
              onChange={(newValue) => {
                const newBlockMap = { ...blockMap, [fieldLabel]: newValue };
                props.onBlockMapChange(newBlockMap);
              }}
            />
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
              <div className="tax_label">{choice.name}</div>
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
                        term: { id: term.id, slug: term.slug },
                      };
                      const newChoiceTerms = handleChoiceChange(
                        checked,
                        target
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
          return (
            <div key={index} className="field_section">
              {choice.title && (
                <ToggleControl
                  className="field_choice"
                  label={__("Title", textDomain)}
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "title"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "title"
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {choice.date && (
                <ToggleControl
                  className="field_choice"
                  label="日付"
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "date"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(checked, "date");
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {choice.excerpt && (
                <ToggleControl
                  className="field_choice"
                  label="抜粋"
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "excerpt"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "excerpt"
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {choice.featured_media && (
                <ToggleControl
                  className="field_choice"
                  label="アイキャッチ画像"
                  checked={choiceItems.some(
                    (choiceField) => choiceField === "featured_media"
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "featured_media"
                    );
                    props.onChange(newChoiceFields);
                  }}
                />
              )}
              {(choice.meta || choice.acf.length > 0) && (
                <>
                  <div className="custom_field_label">
                    {__("Custom Field", textDomain)}
                  </div>
                  <div className="custom_field_area">
                    <div className="custom_field_area">
                      {dispCustumFields({
                        ...Object.entries(choice.meta).reduce(
                          (acc, [key, value]) => ({
                            ...acc,
                            [`meta_${key}`]: value,
                          }),
                          {}
                        ),
                        ...Object.entries(choice.acf).reduce(
                          (acc, [key, value]) => ({
                            ...acc,
                            [`acf_${key}`]: value,
                          }),
                          {}
                        ),
                      })}
                    </div>
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
  const pages = await apiFetch({ path: "/wp/v2/pages" });
  //ページIDが-1である要素をホーム要素として作成
  if (pages && !pages.some((page) => page.id === -1)) {
    pages.unshift({
      id: -1,
      title: { rendered: "ホーム" },
      link: home_url,
      slug: "home",
    });
  }

  const ret_pages = pages
    ? pages.map((page) => ({
        value: page.id,
        slug: page.slug,
        label: page.title.rendered,
        link: page.link,
      }))
    : [];

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

//フィールド情報取得RestAPI関数
export const restFieldes = async (rest_base) => {
  //投稿データに以下のフィールドが含まれているかを調べる
  const selectedFields = [
    "title",
    "date",
    "excerpt",
    "featured_media",
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
