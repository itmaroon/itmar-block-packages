interface FormatSettings {
    userFormat: string;
    freeStrFormat: string;
    decimal: number;
}
interface FormatSelectControlProps {
    titleType: "plaine" | "date" | "user" | string;
    userFormat: string;
    freeStrFormat: string;
    decimal: number;
    onFormatChange: (settings: FormatSettings) => void;
}
export declare const FormatSelectControl: ({ titleType, userFormat, freeStrFormat, decimal, onFormatChange, }: FormatSelectControlProps) => JSX.Element;
/**
 * 値を指定されたフォーマットで整形して返す
 */
export declare const displayFormated: (content: any, userFormat: string | undefined, freeStrFormat: string, decimal: number) => string;
export {};
