interface DateRange {
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
}
interface DateUnit {
    id: string;
    value: string;
    label: string;
    classname: string;
}
export declare const generateDateArray: (dateObj: DateRange, isMonth: boolean) => DateUnit[];
export interface Holiday {
    date: string | number;
    name: string;
}
interface CalendarDay {
    date: number;
    weekday: number;
    holiday?: string;
}
export declare const generateMonthCalendar: (dateString: string, holidays?: Holiday[] | null) => CalendarDay[];
interface DateRange {
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
}
interface PeriodCtrlProps {
    startYear: number;
    endYear: number;
    dateSpan: DateRange;
    isMonth: boolean;
    onChange: (newSpanObj: {
        dateSpan: DateRange;
    }) => void;
}
export declare const PeriodCtrl: ({ startYear, endYear, dateSpan, isMonth, onChange, }: PeriodCtrlProps) => import("react/jsx-runtime").JSX.Element;
interface PeriodQuery {
    after: string;
    before: string;
}
export declare const getPeriodQuery: (dateString: string | undefined | null) => PeriodQuery | null;
export declare const getTodayYearMonth: () => string;
export declare const getTodayYear: () => number;
export declare const getTodayMonth: () => number;
interface MonthRange {
    ym: string;
    from: string;
    to: string;
    year: number;
    month: number;
    lastDay: number;
}
export declare const getMonthRangeYmd: (selectedMonth: string | undefined | null) => MonthRange;
export declare const normalizeDateYYYYMMDD: (value: string) => string;
/**
 * 様々な形式の「日」の入力と「選択された月」を組み合わせて YYYY-MM-DD 形式を返す
 */
export declare const toYmdFromMonthAndDay: (selectedMonth: string | undefined | null, dayValue: string | number | undefined | null) => string;
/**
 * カレンダーの grid-template-areas 用の文字列を生成する
 * @param firstDayOfMonth 月の最初の日の曜日番号 (0:日, 1:月...)
 * @param totalDays 月の総日数 (28-31)
 * @param isMonday 月曜始まりにするかどうか
 */
export declare const generateGridAreas: (firstDayOfMonth: number, totalDays: number, isMonday: boolean) => string;
export {};
