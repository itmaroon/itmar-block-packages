import { createElement, useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import _ from 'lodash';
import { ComboboxControl, ToggleControl, CheckboxControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

//const _ = require("lodash");
const restFetchData = async (path) => {
    try {
        // apiFetch にジェネリクス <T> を渡すことで戻り値に型が付く
        const ret_data = await apiFetch({ path });
        return ret_data;
    }
    catch (error) {
        // エラーメッセージの安全な取り出し
        const errorMessage = error.message || "Unknown error occurred";
        console.error("Error fetching data:", errorMessage);
        // エラー時は undefined を返して呼び出し元で判定できるようにする
        return undefined;
    }
};
//コンボボックスコントロールのレンダリング関数
const SelectControl = (props) => {
    const { selectedSlug, label, homeUrl, fetchOptions } = props;
    const [options, setOptions] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedOptions = await fetchOptions(homeUrl, props);
                setOptions(fetchedOptions);
            }
            catch (error) {
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
    const selectedInfo = options.find((info) => info.slug === selectedSlug);
    return (createElement(ComboboxControl, { label: label, options: options, value: selectedInfo ? selectedInfo.value : undefined, onChange: (newValue) => {
            const newInfo = options.find((info) => info.value === newValue);
            props.onChange(newInfo);
        } }));
};
//選択コントロールのレンダリング関数
const ChoiceControl = (props) => {
    const { selectedSlug, choiceItems, dispTaxonomies, type, blockMap, fetchFunction, } = props;
    const [choices, setChoices] = useState([]);
    useEffect(() => {
        if (!selectedSlug)
            return; //ポストタイプのスラッグが選択されていないときは処理終了
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
            }
            catch (error) {
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
        }
        else {
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
        if (!dataObj || typeof dataObj !== "object")
            return keySet;
        for (const [key, val] of Object.entries(dataObj)) {
            if ((key === "acf" || key === "meta") &&
                val &&
                typeof val === "object" &&
                !Array.isArray(val)) {
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
    function pruneChoiceItemsByObjectKeys(dataObj, items) {
        const validKeys = buildComparableKeySet(dataObj);
        const getItemKey = (item) => {
            if (typeof item === "string")
                return item;
            if (item && typeof item === "object")
                return item.value ?? item.key ?? item.name ?? "";
            return "";
        };
        const next = (items ?? []).filter((item) => validKeys.has(getItemKey(item)));
        // ★ 配列の参照はそのまま、中身だけ置き換える
        items.splice(0, items.length, ...next);
        return items; // 必要なら返す
    }
    //階層化されたカスタムフィールドのフィールド名を表示する関数
    const dispCustumFields = (obj, prefix = "", isImage = false) => {
        return Object.entries(obj).map(([key, value]) => {
            const fieldName = prefix ? `${prefix}.${key}` : key; //prefixはグループ名
            const fieldLabel = key.replace(/^(meta_|acf_)/, "");
            //オブジェクトであって配列でないものがグループと考える
            if (typeof value === "object" &&
                !Array.isArray(value) &&
                value !== null) {
                return (createElement("div", { className: "group_area", key: fieldName },
                    createElement("div", { className: "group_label" }, fieldLabel),
                    createElement("div", { className: "field_group" }, dispCustumFields(value, fieldName, isImage))));
            }
            else {
                if (key === "meta__acf_changed" || key === "meta_footnotes")
                    return null; //_acf_changedは対象外
                //フィールドを表示するブロックの選択肢
                const options = [
                    { value: "itmar/design-title", label: "itmar/design-title" },
                    { value: "core/paragraph", label: "core/paragraph" },
                    { value: "core/image", label: "core/image" },
                    { value: "itmar/slide-mv", label: "itmar/slide-mv" },
                ];
                return (createElement("div", { className: "itmar_custom_field_set", key: fieldName },
                    createElement(ToggleControl, { className: "field_choice", label: fieldLabel, checked: choiceItems.some((choiceField) => choiceField === fieldName), onChange: (checked) => {
                            const newItems = handleChoiceChange(checked, fieldName, choiceItems);
                            props.onChange(newItems);
                        } }),
                    !isImage && (createElement(ComboboxControl, { options: options, value: blockMap[fieldName] || "itmar/design-title", onChange: (newValue) => {
                            props.onBlockMapChange({
                                ...blockMap,
                                [fieldName]: newValue || "",
                            });
                        } }))));
            }
        });
    };
    return (createElement("div", { className: `${type}_section` },
        type === "taxonomy" &&
            choices.map((choice, index) => (createElement("div", { key: index, className: "term_section" },
                createElement("div", { className: "tax_label" },
                    choice.name,
                    createElement(ToggleControl, { label: __("Display", "block-collections"), checked: dispTaxonomies.some((tax) => tax === choice.slug), onChange: (checked) => {
                            const newTax = handleChoiceChange(checked, choice.slug, dispTaxonomies);
                            props.onSetDispTax(newTax);
                        } })),
                choice.terms?.map((term, tIndex) => (createElement(CheckboxControl, { key: tIndex, label: term.name, checked: choiceItems.some((c) => c.taxonomy === choice.slug && c.term.id === term.id), onChange: (checked) => {
                        const target = {
                            taxonomy: choice.slug,
                            term: { id: term.id, slug: term.slug, name: term.name },
                        };
                        props.onChange(handleChoiceChange(checked, target, choiceItems));
                    } })))))),
        (type === "field" || type === "imgField") &&
            choices.map((choice, index) => {
                const isImgMode = type === "imgField";
                return (createElement("div", { key: index, className: "field_section" },
                    !isImgMode && choice.title && (createElement(ToggleControl, { label: __("Title", "block-collections"), checked: choiceItems.includes("title"), onChange: (checked) => props.onChange(handleChoiceChange(checked, "title", choiceItems)) })),
                    createElement("div", { className: "custom_field_area" }, dispCustumFields({
                        ...Object.entries(choice.meta || {}).reduce((acc, [k, v]) => ({ ...acc, [`meta_${k}`]: v }), {}),
                        ...Object.entries(choice.acf || {})
                            .filter(([k]) => !k.endsWith("_source"))
                            .reduce((acc, [k, v]) => ({ ...acc, [`acf_${k}`]: v }), {}),
                    }, "", isImgMode))));
            })));
};
const fetchPagesOptions = async (home_url) => {
    const allPages = [];
    let page = 1;
    while (true) {
        // apiFetchに型を指定
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
        if (!items || items.length < 100)
            break;
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
    const ret_pages = allPages.map((p) => ({
        // ComboboxControl のために string に変換
        value: String(p.id),
        slug: p.slug,
        label: p.title?.rendered ?? "",
        link: p.link || (p.slug ? `${home_url}/${p.slug}` : home_url),
    }));
    return ret_pages;
};
const fetchArchiveOptions = async (home_url) => {
    // apiFetchの戻り値は、キーが投稿タイプ名のオブジェクト
    const response = await apiFetch({
        path: "/wp/v2/types",
    });
    let idCounter = 0;
    return Object.keys(response).reduce((acc, key) => {
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
        }
        else if (typeof postType.has_archive === "string") {
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
/**
 * 1. 投稿データ取得RestAPI関数
 */
const fetchPostOptions = async (home_url, props = {}) => {
    const perPage = Math.min(Number(props.perPage || 100), 100);
    const status = props.status || "publish"; // 管理画面で下書き等も含めたいなら 'any' を検討
    const orderby = props.orderby || "title";
    const order = props.order || "asc";
    const search = props.search ? String(props.search) : "";
    const restBase = props.restBase || "";
    const allPosts = [];
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
        if (search)
            params.set("search", search);
        const path = `/wp/v2/${encodeURIComponent(restBase)}?${params.toString()}`;
        const posts = await apiFetch({ path });
        if (!Array.isArray(posts) || posts.length === 0)
            break;
        allPosts.push(...posts);
        // これ以上ページがない（=最終ページ）と判断
        if (posts.length < perPage)
            break;
    }
    // title.rendered はHTMLを含むことがあるのでタグを除去
    const stripTags = (html) => String(html || "")
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
const restTaxonomies = async (post_type) => {
    if (!post_type)
        return;
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
    return await Promise.all(taxonomyPromises);
};
const termToDispObj = (terms, connectString) => {
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
    const displayObj = {};
    for (const taxonomy in result) {
        displayObj[taxonomy] = result[taxonomy].join(connectString);
    }
    return displayObj;
};
/**
 * 4. フィールド情報取得RestAPI関数
 */
const restFieldes = async (rest_base) => {
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
    return await apiFetch({
        path: `/wp/v2/${rest_base}?_fields=${fieldsParam}&per_page=1&order=desc`,
    });
};
// --- 各コンポーネントの型定義 ---
/**
 * 固定ページ選択用
 */
const PageSelectControl = (props) => createElement(SelectControl, { ...props, fetchOptions: fetchPagesOptions });
/**
 * アーカイブ（投稿タイプ）選択用
 */
const ArchiveSelectControl = (props) => createElement(SelectControl, { ...props, fetchOptions: fetchArchiveOptions });
/**
 * 投稿（各投稿タイプの中身）選択用
 */
const PostSelectControl = (props) => createElement(SelectControl, { ...props, fetchOptions: fetchPostOptions });
/**
 * タクソノミー・ターム選択用
 */
const TermChoiceControl = (props) => createElement(ChoiceControl, { ...props, fetchFunction: restTaxonomies });
/**
 * カスタムフィールド（ACF/Meta）選択用
 */
const FieldChoiceControl = (props) => (createElement(ChoiceControl, { ...props, type: "field" // フィールド用であることを固定
    , fetchFunction: restFieldes }));

export { ArchiveSelectControl, FieldChoiceControl, PageSelectControl, PostSelectControl, TermChoiceControl, fetchArchiveOptions, fetchPagesOptions, fetchPostOptions, restFetchData, restFieldes, restTaxonomies, termToDispObj };
//# sourceMappingURL=wordpressApi.js.map
