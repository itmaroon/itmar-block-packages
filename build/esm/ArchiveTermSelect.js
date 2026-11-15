import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SelectControl, ComboboxControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * アーカイブのURLに付ける絞り込みの文字列。
 * Pickup Posts が読む `?terms={"タクソノミー":"スラッグ"}` の形（JSONはエンコードして渡す）。
 * 絞り込みが無いときは空文字。
 */
const archiveTermQuery = (term) => term && term.taxonomy && term.slug
    ? `?terms=${encodeURIComponent(JSON.stringify({ [term.taxonomy]: term.slug }))}`
    : "";
/** 絞り込みを付ける前のアーカイブのURL（`?` 以降を除く） */
const archiveBaseUrl = (url) => (url ?? "").split("?")[0];
/**
 * アーカイブのリンクの絞り込み。選んだ投稿タイプに結びついたタクソノミーと、
 * そのターム（検索できるコンボボックス）を選ぶ。タクソノミーが無い投稿タイプでは何も出さない。
 */
const ArchiveTermSelect = ({ postType, value, onChange, }) => {
    const [taxonomies, setTaxonomies] = useState([]);
    const [terms, setTerms] = useState([]);
    const [filter, setFilter] = useState("");
    const taxonomy = value?.taxonomy ?? "";
    //投稿タイプに結びついたタクソノミー（REST で使えるものだけ）
    useEffect(() => {
        let cancelled = false;
        setTaxonomies([]);
        if (!postType)
            return;
        (async () => {
            try {
                const type = await apiFetch({ path: `/wp/v2/types/${postType}` });
                const slugs = type?.taxonomies ?? [];
                const infos = await Promise.all(slugs.map(async (slug) => {
                    try {
                        const t = await apiFetch({ path: `/wp/v2/taxonomies/${slug}` });
                        return t?.rest_base
                            ? { slug, name: t.name, rest_base: t.rest_base }
                            : null;
                    }
                    catch {
                        return null;
                    }
                }));
                if (!cancelled) {
                    setTaxonomies(infos.filter((i) => !!i));
                }
            }
            catch {
                if (!cancelled)
                    setTaxonomies([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [postType]);
    //選んだタクソノミーのターム（絞り込みの文字で検索。投稿が無いタームも出す）
    const restBase = taxonomies.find((t) => t.slug === taxonomy)?.rest_base;
    useEffect(() => {
        let cancelled = false;
        setTerms([]);
        if (!restBase)
            return;
        (async () => {
            try {
                const params = new URLSearchParams({
                    per_page: "100",
                    hide_empty: "false",
                    _fields: "id,name,slug",
                });
                if (filter)
                    params.set("search", filter);
                const list = await apiFetch({
                    path: `/wp/v2/${restBase}?${params.toString()}`,
                });
                if (!cancelled)
                    setTerms(list);
            }
            catch {
                if (!cancelled)
                    setTerms([]);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [restBase, filter]);
    if (!postType || taxonomies.length === 0)
        return null;
    const termOptions = terms.map((t) => ({ value: t.slug, label: t.name }));
    //選択中のタームが検索結果から外れても、ラベルが消えないようにする
    if (value?.slug && !termOptions.some((o) => o.value === value.slug)) {
        termOptions.unshift({ value: value.slug, label: value.slug });
    }
    return (jsxs(Fragment, { children: [jsx(SelectControl, { label: __("Narrow down by taxonomy", "block-collections"), value: taxonomy, options: [
                    { label: __("Do not narrow down", "block-collections"), value: "" },
                    ...taxonomies.map((t) => ({ label: t.name, value: t.slug })),
                ], onChange: (newTax) => {
                    setFilter("");
                    //タクソノミーを変えたら、ターム選びからやり直す
                    onChange(newTax ? { taxonomy: newTax, slug: "" } : undefined);
                } }), taxonomy && (jsx(ComboboxControl, { label: __("Term", "block-collections"), value: value?.slug ?? "", options: termOptions, onFilterValueChange: (text) => setFilter(text), onChange: (slug) => {
                    onChange(slug ? { taxonomy, slug } : { taxonomy, slug: "" });
                }, help: __("The link goes to the archive page narrowed down to this term.", "block-collections") }))] }));
};

export { ArchiveTermSelect, archiveBaseUrl, archiveTermQuery };
//# sourceMappingURL=ArchiveTermSelect.js.map
