/** アーカイブのリンクに足す絞り込み。1つのタクソノミーの1つのターム */
export interface ArchiveTerm {
    taxonomy: string;
    slug: string;
}
/**
 * アーカイブのURLに付ける絞り込みの文字列。
 * Pickup Posts が読む `?terms={"タクソノミー":"スラッグ"}` の形（JSONはエンコードして渡す）。
 * 絞り込みが無いときは空文字。
 */
export declare const archiveTermQuery: (term?: ArchiveTerm | null) => string;
/** 絞り込みを付ける前のアーカイブのURL（`?` 以降を除く） */
export declare const archiveBaseUrl: (url?: string) => string;
interface ArchiveTermSelectProps {
    /** 選んだ投稿タイプのスラッグ（アーカイブを選んだときの slug） */
    postType: string | undefined;
    value: ArchiveTerm | undefined;
    /** 絞り込みなしにしたときは undefined */
    onChange: (next: ArchiveTerm | undefined) => void;
}
/**
 * アーカイブのリンクの絞り込み。選んだ投稿タイプに結びついたタクソノミーと、
 * そのターム（検索できるコンボボックス）を選ぶ。タクソノミーが無い投稿タイプでは何も出さない。
 */
export declare const ArchiveTermSelect: ({ postType, value, onChange, }: ArchiveTermSelectProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
