import { useState, useEffect } from "@wordpress/element";
import { ComboboxControl, CheckboxControl } from "@wordpress/components";
import apiFetch from "@wordpress/api-fetch";

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

//タームの選択コントロールのレンダリング関数
const ChoiceControl = (props) => {
  const { selectedSlug, choiceTerms, type, label, fetchFunction } = props;
  const [choices, setChoices] = useState([]);

  useEffect(() => {
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

  const handleTermChange = (checked, target) => {
    if (checked) {
      // targetが重複していない場合のみ追加
      if (
        !choiceTerms.some(
          (term) =>
            term.taxonomy === target.taxonomy && term.term === target.term
        )
      ) {
        return [...choiceTerms, target];
      }
    } else {
      // targetを配列から削除
      return choiceTerms.filter(
        (term) => term.taxonomy !== target.taxonomy || term.term !== target.term
      );
    }
    return choiceTerms;
  };

  return (
    <div className="tax_section">
      <div>{label}</div>
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
                    checked={choiceTerms.some(
                      (choiceTerm) =>
                        choiceTerm.taxonomy === choice.slug &&
                        choiceTerm.term === term.slug
                    )}
                    onChange={(checked) => {
                      const target = { taxonomy: choice.slug, term: term.slug };
                      const newChoiceTerms = handleTermChange(checked, target);
                      props.onChange(newChoiceTerms);
                    }}
                  />
                );
              })}
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
        link: `${home_url}/${postType.slug}`,
        label: postType.name,
      });
    } else if (typeof postType.has_archive === "string") {
      //アーカイブ名がついているとき
      acc.push({
        value: idCounter++,
        slug: postType.slug,
        link: `${home_url}/${postType.has_archive}`,
        label: postType.name,
      });
    }
    return acc;
  }, []);
};

//タクソノミー取得RestAPI関数
export const restTaxonomies = async (post_type) => {
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
// export const restFieldes = async (post_type) => {
//   const response = await apiFetch({
//     path: `/wp/v2/types/${post_type}?context=edit`,
//   });
//   return response;
// };

export const PageSelectControl = (props) => (
  <SelectControl {...props} fetchOptions={fetchPagesOptions} />
);

export const ArchiveSelectControl = (props) => (
  <SelectControl {...props} fetchOptions={fetchArchiveOptions} />
);

export const TermChoiceControl = (props) => (
  <ChoiceControl {...props} fetchFunction={restTaxonomies} />
);

// export const FieldChoiceControl = (props) => (
//   <ChoiceControl {...props} fetchFunction={restFieldes} />
// );
