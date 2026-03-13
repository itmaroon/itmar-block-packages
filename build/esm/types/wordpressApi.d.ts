export declare const restFetchData: <T = any>(path: string) => Promise<T | undefined>;
interface SelectOption {
    label: string;
    value: string;
    slug: string;
    [key: string]: any;
}
interface SelectControlProps {
    selectedSlug: string | undefined;
    label: string;
    homeUrl: string;
    fetchOptions: (homeUrl: string, props: any) => Promise<SelectOption[]>;
    onChange: (newInfo: SelectOption | undefined) => void;
    restBase?: string;
    status?: string;
    perPage?: number;
    orderby?: string;
    order?: string;
    search?: string;
}
interface ChoiceControlProps {
    selectedSlug: string | undefined;
    choiceItems: any[];
    dispTaxonomies: string[];
    type: "taxonomy" | "field" | "imgField";
    blockMap: Record<string, string>;
    textDomain?: string;
    fetchFunction: (slug: string) => Promise<any[] | undefined>;
    onChange: (items: any[]) => void;
    onBlockMapChange: (map: Record<string, string>) => void;
    onSetDispTax: (taxonomies: string[]) => void;
}
interface PageOption {
    value: string;
    slug: string;
    label: string;
    link: string;
}
export declare const fetchPagesOptions: (home_url: string) => Promise<PageOption[]>;
interface ArchiveOption {
    value: string;
    slug: string;
    rest_base: string;
    link: string;
    label: string;
}
export declare const fetchArchiveOptions: (home_url: string) => Promise<ArchiveOption[]>;
interface PostOption {
    value: string;
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
export declare const fetchPostOptions: (home_url: string, props?: any) => Promise<PostOption[]>;
/**
 * 2. タクソノミー取得RestAPI関数
 */
export declare const restTaxonomies: (post_type: string) => Promise<TaxonomyObject[] | undefined>;
export declare const termToDispObj: (terms: any[], connectString: string) => Record<string, string>;
/**
 * 4. フィールド情報取得RestAPI関数
 */
export declare const restFieldes: (rest_base: string) => Promise<any[]>;
/**
 * 固定ページ選択用
 */
export declare const PageSelectControl: (props: Omit<SelectControlProps, "fetchOptions">) => JSX.Element;
/**
 * アーカイブ（投稿タイプ）選択用
 */
export declare const ArchiveSelectControl: (props: Omit<SelectControlProps, "fetchOptions">) => JSX.Element;
/**
 * 投稿（各投稿タイプの中身）選択用
 */
export declare const PostSelectControl: (props: Omit<SelectControlProps, "fetchOptions">) => JSX.Element;
/**
 * タクソノミー・ターム選択用
 */
export declare const TermChoiceControl: (props: Omit<ChoiceControlProps, "fetchFunction">) => JSX.Element;
/**
 * カスタムフィールド（ACF/Meta）選択用
 */
export declare const FieldChoiceControl: (props: Omit<ChoiceControlProps, "fetchFunction" | "type">) => JSX.Element;
/**
 * 画像系カスタムフィールド選択用
 */
export declare const ImageFieldChoiceControl: (props: Omit<ChoiceControlProps, "fetchFunction" | "type">) => JSX.Element;
export {};
