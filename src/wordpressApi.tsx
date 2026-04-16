import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import _ from "lodash";
import {
  ComboboxControl,
  CheckboxControl,
  ToggleControl,
} from "@wordpress/components";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

//const _ = require("lodash");

export const restFetchData = async <T = any,>(
  path: string,
): Promise<T | undefined> => {
  try {
    // apiFetch にジェネリクス <T> を渡すことで戻り値に型が付く
    const ret_data = await apiFetch<T>({ path });
    return ret_data;
  } catch (error: any) {
    // エラーメッセージの安全な取り出し
    const errorMessage = error.message || "Unknown error occurred";
    console.error("Error fetching data:", errorMessage);

    // エラー時は undefined を返して呼び出し元で判定できるようにする
    return undefined;
  }
};

// 1. オプション1項目の型定義
interface SelectOption {
  label: string;
  value: string;
  slug: string;
  [key: string]: any; // その他のメタデータも許容
}

// 2. Props の型定義
interface SelectControlProps {
  selectedSlug: string | undefined;
  label: string;
  homeUrl: string;
  fetchOptions: (homeUrl: string, props: any) => Promise<SelectOption[]>;
  onChange: (newInfo: SelectOption | undefined) => void;
  // useEffect の依存配列に使われているプロパティ群
  restBase?: string;
  status?: string;
  perPage?: number;
  orderby?: string;
  order?: string;
  search?: string;
}

//コンボボックスコントロールのレンダリング関数
const SelectControl = (props: SelectControlProps) => {
  const { selectedSlug, label, homeUrl, fetchOptions } = props;
  const [options, setOptions] = useState<SelectOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOptions = await fetchOptions(homeUrl, props);
        setOptions(fetchedOptions);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [
    fetchOptions,
    homeUrl,
    props.restBase,
    props.status,
    props.perPage,
    props.orderby,
    props.order,
    props.search,
  ]);

  const selectedInfo = options.find(
    (info: SelectOption) => info.slug === selectedSlug,
  );
  return (
    <ComboboxControl
      label={label}
      options={options}
      value={selectedInfo ? selectedInfo.value : undefined}
      onChange={(newValue) => {
        const newInfo = options.find(
          (info: SelectOption) => info.value === newValue,
        );
        props.onChange(newInfo);
      }}
    />
  );
};

// --- 型定義 ---

interface Term {
  id: number;
  slug: string;
  name: string;
}

interface Choice {
  name?: string;
  slug?: string;
  terms?: Term[];
  title?: any;
  content?: any;
  date?: any;
  excerpt?: any;
  featured_media?: any;
  link?: any;
  meta?: Record<string, any>;
  acf?: Record<string, any>;
}

interface ChoiceItemTerm {
  taxonomy: string;
  term: Term;
}

// choiceItems は文字列（フィールド名）の配列か、タクソノミー情報の配列のいずれか
type ChoiceItem = string | ChoiceItemTerm;

interface ChoiceControlProps {
  selectedSlug: string | undefined;
  choiceItems: any[]; // 破壊的変更(splice)があるため any[] としていますが、本来は状態として管理すべきです
  dispTaxonomies: string[];
  type: "taxonomy" | "field" | "imgField";
  blockMap: Record<string, string>;
  textDomain?: string;
  fetchFunction: (slug: string) => Promise<any[] | undefined>;
  onChange: (items: any[]) => void;
  onBlockMapChange: (map: Record<string, string>) => void;
  onSetDispTax: (taxonomies: string[]) => void;
}

//選択コントロールのレンダリング関数
const ChoiceControl = (props: ChoiceControlProps) => {
  const {
    selectedSlug,
    choiceItems,
    dispTaxonomies,
    type,
    blockMap,
    fetchFunction,
  } = props;

  const [choices, setChoices] = useState<any[]>([]);
  useEffect(() => {
    if (!selectedSlug) return; //ポストタイプのスラッグが選択されていないときは処理終了
    const fetchData = async () => {
      try {
        const fetchChoices = await fetchFunction(selectedSlug);
        // ここでチェックを入れる
        if (!fetchChoices) {
          setChoices([]); // データがない場合は空配列にする
          return;
        }

        setChoices(fetchChoices);
        //指定の投稿タイプに含まれないフィールドを削除する
        pruneChoiceItemsByObjectKeys(fetchChoices[0], choiceItems);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    };
    fetchData();
  }, [selectedSlug, fetchFunction]);

  //選択肢が変わったときに選択されている項目の配列内容を更新するハンドラ
  const handleChoiceChange = (
    checked: boolean,
    target: any,
    setItems: any[],
  ) => {
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
  function buildComparableKeySet(dataObj: any) {
    const keySet = new Set<string>();

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
  function pruneChoiceItemsByObjectKeys(dataObj: any, items: any[]) {
    const validKeys = buildComparableKeySet(dataObj);

    const getItemKey = (item: any): string => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object")
        return item.value ?? item.key ?? item.name ?? "";
      return "";
    };

    const next = (items ?? []).filter((item) =>
      validKeys.has(getItemKey(item)),
    );

    // ★ 配列の参照はそのまま、中身だけ置き換える
    items.splice(0, items.length, ...next);

    return items; // 必要なら返す
  }

  //階層化されたカスタムフィールドのフィールド名を表示する関数
  const dispCustumFields = (obj: any, prefix = "", isImage = false) => {
    return Object.entries(obj).map(([key, value]) => {
      const fieldName = prefix ? `${prefix}.${key}` : key; //prefixはグループ名

      const fieldLabel = key.replace(/^(meta_|acf_)/, "");
      //オブジェクトであって配列でないものがグループと考える
      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        return (
          <div className="group_area" key={fieldName}>
            <div className="group_label">{fieldLabel}</div>
            <div className="field_group">
              {dispCustumFields(value, fieldName, isImage)}
            </div>
          </div>
        );
      } else {
        if (key === "meta__acf_changed" || key === "meta_footnotes")
          return null; //_acf_changedは対象外

        //フィールドを表示するブロックの選択肢
        const options = [
          { value: "itmar/design-title", label: "itmar/design-title" },
          { value: "core/paragraph", label: "core/paragraph" },
          { value: "core/image", label: "core/image" },
          { value: "itmar/slide-mv", label: "itmar/slide-mv" },
        ];
        return (
          <div className="itmar_custom_field_set" key={fieldName}>
            <ToggleControl
              className="field_choice"
              label={fieldLabel}
              checked={choiceItems.some(
                (choiceField) => choiceField === fieldName,
              )}
              onChange={(checked: boolean) => {
                const newItems = handleChoiceChange(
                  checked,
                  fieldName,
                  choiceItems,
                );
                props.onChange(newItems);
              }}
            />
            {!isImage && (
              <ComboboxControl
                options={options}
                value={blockMap[fieldName] || "itmar/design-title"}
                onChange={(newValue) => {
                  props.onBlockMapChange({
                    ...blockMap,
                    [fieldName]: newValue || "",
                  });
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
      {/* タクソノミー表示セクション */}
      {type === "taxonomy" &&
        choices.map((choice, index) => (
          <div key={index} className="term_section">
            <div className="tax_label">
              {choice.name}
              <ToggleControl
                label={__("Display", "block-collections")}
                checked={dispTaxonomies.some((tax) => tax === choice.slug)}
                onChange={(checked: boolean) => {
                  const newTax = handleChoiceChange(
                    checked,
                    choice.slug,
                    dispTaxonomies,
                  );
                  props.onSetDispTax(newTax);
                }}
              />
            </div>
            {choice.terms?.map((term: any, tIndex: number) => (
              <CheckboxControl
                key={tIndex}
                label={term.name}
                checked={choiceItems.some(
                  (c: any) =>
                    c.taxonomy === choice.slug && c.term.id === term.id,
                )}
                onChange={(checked) => {
                  const target = {
                    taxonomy: choice.slug,
                    term: { id: term.id, slug: term.slug, name: term.name },
                  };
                  props.onChange(
                    handleChoiceChange(checked, target, choiceItems),
                  );
                }}
              />
            ))}
          </div>
        ))}

      {/* フィールド表示セクション (標準フィールド + カスタムフィールド) */}
      {type === "field" &&
        choices.map((choice, index) => {
          //metaの対象カスタムフィールドが含まれるかのフラグ
          const metaFlg =
            choice.meta &&
            !Object.keys(choice.meta).every(
              (key) => key === "_acf_changed" || key === "footnotes",
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
                    (choiceField) => choiceField === "title",
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "title",
                      choiceItems,
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
                    (choiceField) => choiceField === "content",
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "content",
                      choiceItems,
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
                    (choiceField) => choiceField === "date",
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "date",
                      choiceItems,
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
                    (choiceField) => choiceField === "excerpt",
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "excerpt",
                      choiceItems,
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
                    (choiceField) => choiceField === "featured_media",
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "featured_media",
                      choiceItems,
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
                      (choiceField) => choiceField === "link",
                    )}
                    onChange={(checked) => {
                      const newChoiceFields = handleChoiceChange(
                        checked,
                        "link",
                        choiceItems,
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
                        link: newValue ?? "",
                      };
                      props.onBlockMapChange(newBlockMap);
                    }}
                  />
                  <p>
                    {__(
                      "If no block is specified, a link will be set to the parent block, Design Group.",
                      "block-collections",
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
                        {},
                      ),
                      // acf は「同名で _source があるもののベース側を除く」
                      ...Object.entries(choice.acf)
                        .filter(([key]) => !key.endsWith("_source"))
                        .reduce(
                          (acc, [key, value]) => ({
                            ...acc,
                            [`acf_${key}`]: value,
                          }),
                          {},
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
              (key) => key === "_acf_changed" || key === "footnotes",
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
                    (choiceField) => choiceField === "content",
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "content",
                      choiceItems,
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
                    (choiceField) => choiceField === "featured_media",
                  )}
                  onChange={(checked) => {
                    const newChoiceFields = handleChoiceChange(
                      checked,
                      "featured_media",
                      choiceItems,
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
                          {},
                        ),
                        // acf は「同名で _source があるもののベース側を除く」
                        ...Object.entries(choice.acf)
                          .filter(([key]) => !key.endsWith("_source"))
                          .reduce(
                            (acc, [key, value]) => ({
                              ...acc,
                              [`acf_${key}`]: value,
                            }),
                            {},
                          ),
                      },
                      "",
                      true,
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
// 1. APIから返ってくるページオブジェクトの型定義
interface WPPage {
  id: number;
  slug: string;
  link: string;
  title: {
    rendered: string;
  };
}

// 2. 返却するオプションの型定義（valueはComboboxの仕様に合わせてstringに）
interface PageOption {
  value: string;
  slug: string;
  label: string;
  link: string;
}
export const fetchPagesOptions = async (
  home_url: string,
): Promise<PageOption[]> => {
  const allPages: (
    | WPPage
    | { id: number; title: { rendered: string }; link: string; slug: string }
  )[] = [];
  let page = 1;

  while (true) {
    // apiFetchに型を指定
    const items = await apiFetch<WPPage[]>({
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

  // 最終的な整形
  const ret_pages: PageOption[] = allPages.map((p) => ({
    // ComboboxControl のために string に変換
    value: String(p.id),
    slug: p.slug,
    label: p.title?.rendered ?? "",
    link: p.link || (p.slug ? `${home_url}/${p.slug}` : home_url),
  }));
  return ret_pages;
};

//アーカイブ情報取得RestAPI関数
// 1. WP REST API /types のレスポンス情報の型定義
interface WPPostType {
  name: string;
  slug: string;
  rest_base: string;
  has_archive: boolean | string; // boolean または カスタムスラッグ(string)
  [key: string]: any;
}

// 2. 返却するオプションの型定義
interface ArchiveOption {
  value: string; // ComboboxControlに合わせてstring
  slug: string;
  rest_base: string;
  link: string;
  label: string;
}

export const fetchArchiveOptions = async (
  home_url: string,
): Promise<ArchiveOption[]> => {
  // apiFetchの戻り値は、キーが投稿タイプ名のオブジェクト
  const response = await apiFetch<Record<string, WPPostType>>({
    path: "/wp/v2/types",
  });

  let idCounter = 0;
  return Object.keys(response).reduce<ArchiveOption[]>((acc, key) => {
    const postType = response[key];

    // アーカイブが有効なものだけを抽出
    if (postType.has_archive === true) {
      acc.push({
        value: String(idCounter++),
        slug: postType.slug,
        rest_base: postType.rest_base,
        link: `${home_url}/${postType.slug}`,
        label: postType.name,
      });
    } else if (typeof postType.has_archive === "string") {
      //アーカイブ名がついているとき
      acc.push({
        value: String(idCounter++),
        slug: postType.slug,
        rest_base: postType.rest_base,
        link: `${home_url}/${postType.has_archive}`,
        label: postType.name,
      });
    }
    return acc;
  }, []);
};

//投稿データ取得RestAPI関数
// --- 型定義 ---

interface PostOption {
  value: string; // ComboboxControl 用
  label: string;
  slug: string;
  link: string;
  rest_base: string;
  post_id: number;
}

interface TaxonomyObject {
  slug: string;
  name: string;
  rest_base: string;
  terms: any[];
}

/**
 * 1. 投稿データ取得RestAPI関数
 */
export const fetchPostOptions = async (
  home_url: string,
  props: any = {},
): Promise<PostOption[]> => {
  const perPage = Math.min(Number(props.perPage || 100), 100);
  const status = props.status || "publish"; // 管理画面で下書き等も含めたいなら 'any' を検討
  const orderby = props.orderby || "title";
  const order = props.order || "asc";
  const search = props.search ? String(props.search) : "";
  const restBase = props.restBase || "";

  const allPosts: any[] = [];
  const maxPagesSafety = 50; // 念のための安全上限

  for (let page = 1; page <= maxPagesSafety; page++) {
    const params = new URLSearchParams();
    params.set("per_page", String(perPage));
    params.set("page", String(page));
    params.set("status", status);
    params.set("orderby", orderby);
    params.set("order", order);
    // 必要なフィールドだけ返して軽量化
    params.set("_fields", "id,slug,title,link");

    if (search) params.set("search", search);

    const path = `/wp/v2/${encodeURIComponent(restBase)}?${params.toString()}`;

    const posts = await apiFetch({ path });

    if (!Array.isArray(posts) || posts.length === 0) break;

    allPosts.push(...posts);

    // これ以上ページがない（=最終ページ）と判断
    if (posts.length < perPage) break;
  }

  // title.rendered はHTMLを含むことがあるのでタグを除去
  const stripTags = (html: string) =>
    String(html || "")
      .replace(/<[^>]*>/g, "")
      .trim();

  return allPosts.map((post) => {
    const title = stripTags(post?.title?.rendered) || "(no title)";
    return {
      value: String(post.id), // 重要: stringに変換
      label: title,
      slug: post.slug,
      link: post.link || `${home_url}/?p=${post.id}`,
      rest_base: restBase,
      post_id: Number(post.id),
    };
  });
};

/**
 * 2. タクソノミー取得RestAPI関数
 */
export const restTaxonomies = async (
  post_type: string,
): Promise<TaxonomyObject[] | undefined> => {
  if (!post_type) return;

  const response = await apiFetch<any>({
    path: `/wp/v2/types/${post_type}?context=edit`,
  });

  const taxonomies = response.taxonomies as string[];

  const taxonomyPromises = taxonomies.map(async (slug) => {
    const taxonomyResponse = await apiFetch<any>({
      path: `/wp/v2/taxonomies/${slug}?context=edit`,
    });
    const terms = await apiFetch<any[]>({
      path: `/wp/v2/${taxonomyResponse.rest_base}`,
    });

    return {
      slug: slug,
      name: taxonomyResponse.name,
      rest_base: taxonomyResponse.rest_base,
      terms: terms,
    };
  });

  return await Promise.all(taxonomyPromises);
};

export const termToDispObj = (
  terms: any[],
  connectString: string,
): Record<string, string> => {
  const result = terms.reduce((acc: Record<string, string[]>, item) => {
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
  const displayObj: Record<string, string> = {};
  for (const taxonomy in result) {
    displayObj[taxonomy] = result[taxonomy].join(connectString);
  }

  return displayObj;
};

/**
 * 4. フィールド情報取得RestAPI関数
 */
export const restFieldes = async (rest_base: string): Promise<any[]> => {
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
  const ret_data = await apiFetch<any[]>({
    path: `/wp/v2/${rest_base}?_fields=${fieldsParam}&per_page=1&order=desc`,
  });

  return ret_data;
};

// --- 各コンポーネントの型定義 ---

/**
 * 固定ページ選択用
 */
export const PageSelectControl = (
  props: Omit<SelectControlProps, "fetchOptions">,
) => <SelectControl {...props} fetchOptions={fetchPagesOptions} />;

/**
 * アーカイブ（投稿タイプ）選択用
 */
export const ArchiveSelectControl = (
  props: Omit<SelectControlProps, "fetchOptions">,
) => <SelectControl {...props} fetchOptions={fetchArchiveOptions} />;

/**
 * 投稿（各投稿タイプの中身）選択用
 */
export const PostSelectControl = (
  props: Omit<SelectControlProps, "fetchOptions">,
) => <SelectControl {...props} fetchOptions={fetchPostOptions} />;

/**
 * タクソノミー・ターム選択用
 */
export const TermChoiceControl = (
  props: Omit<ChoiceControlProps, "fetchFunction">,
) => <ChoiceControl {...props} fetchFunction={restTaxonomies} />;

/**
 * カスタムフィールド（ACF/Meta）選択用
 */
export const FieldChoiceControl = (
  props: Omit<ChoiceControlProps, "fetchFunction" | "type">,
) => (
  <ChoiceControl
    {...props}
    type="field" // フィールド用であることを固定
    fetchFunction={restFieldes}
  />
);

/**
 * 画像系カスタムフィールド選択用
 */
export const ImageFieldChoiceControl = (
  props: Omit<ChoiceControlProps, "fetchFunction" | "type">,
) => (
  <ChoiceControl
    {...props}
    type="imgField" // 画像用であることを固定
    fetchFunction={restFieldes}
  />
);
