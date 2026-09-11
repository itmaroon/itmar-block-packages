/**
 * カレンダーの grid-template-areas 生成。
 *
 * 【重要】このモジュールは @wordpress パッケージに依存しない。ビュースクリプトから
 * 参照されるため、依存を足すとエディタ用パッケージがフロントエンドへ配信される。
 * 以前は DateElm.tsx（日付コントロールUI）に同居していた。
 */
/**
 * カレンダーの grid-template-areas 用の文字列を生成する
 * @param firstDayOfMonth 月の最初の日の曜日番号 (0:日, 1:月...)
 * @param totalDays その月の日数
 * @param isMonday 月曜始まりにするかどうか
 */
export declare const generateGridAreas: (firstDayOfMonth: number, totalDays: number, isMonday: boolean) => string;
