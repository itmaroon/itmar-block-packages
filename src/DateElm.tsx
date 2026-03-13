import { createElement, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { nanoid } from "nanoid/non-secure";
import {
  PanelBody,
  PanelRow,
  __experimentalNumberControl as NumberControl,
} from "@wordpress/components";

// 1. 日付範囲オブジェクトの型定義
interface DateRange {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
}

// 2. 戻り値の配列要素の型定義
interface DateUnit {
  id: string;
  value: string;
  label: string;
  classname: string;
}

//期間の設定から選択できる月の情報オブジェクトを配列にする関数
export const generateDateArray = (
  dateObj: DateRange,
  isMonth: boolean,
): DateUnit[] => {
  const { startYear, startMonth, endYear, endMonth } = dateObj;
  const result: DateUnit[] = [];

  for (let year = startYear; year <= endYear; year++) {
    if (isMonth) {
      const monthStart = year === startYear ? startMonth : 1;
      const monthEnd = year === endYear ? endMonth : 12;

      for (let month = monthStart; month <= monthEnd; month++) {
        const unitObj = {
          id: nanoid(5),
          value: `${year}/${month.toString().padStart(2, "0")}`,
          label: `${year}/${month.toString().padStart(2, "0")}`,
          classname: "filter_date",
        };
        result.push(unitObj);
      }
    } else {
      const unitObj = {
        id: nanoid(5),
        value: `${year}`,
        label: `${year}`,
        classname: "filter_date",
      };
      result.push(unitObj);
    }
  }

  return result;
};

//与えられた月から日付と曜日を要素とする配列を生成する
// 1. 祝日データの型定義
export interface Holiday {
  date: string | number; // "2026-03-20" や 20260320 など
  name: string; // "春分の日"
}

// 2. カレンダーの1日分を表す型定義
interface CalendarDay {
  date: number;
  weekday: number; // 0 (日) ～ 6 (土)
  holiday?: string; // 祝日の場合のみ名前が入る
}
export const generateMonthCalendar = (
  dateString: string,
  holidays: Holiday[] | null = null,
): CalendarDay[] => {
  const [year, month] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();

  const calendar = [];

  for (let day = 1; day <= lastDay; day++) {
    date.setDate(day);
    //祝日の情報
    const holidayItem = holidays?.find((item) => {
      const s = String(item.date ?? "");

      // item.date から YYYY, MM, DD を取り出す（"YYYYMMDD" / "YYYY-MM-DD" などに対応）
      const yearStr = s.slice(0, 4);
      const monthStr = s.replace(/\D/g, "").slice(4, 6); // 数字だけにして5-6桁
      const dayStr = s.replace(/\D/g, "").slice(6, 8); // 数字だけにして7-8桁

      const itemYear = Number(yearStr);
      const itemMonth = Number(monthStr);
      const itemDay = Number(dayStr);

      return itemYear === year && itemMonth === month && itemDay === day;
    });
    //日付情報オブジェクト
    const dayObj = holidayItem
      ? {
          date: day,
          weekday: date.getDay(),
          holiday: holidayItem.name,
        }
      : {
          date: day,
          weekday: date.getDay(),
        };
    calendar.push(dayObj);
  }

  return calendar;
};

//期間設定のインスペクターコントロール
// 1. dateSpan の構造を定義（以前の DateRange インターフェースを再利用）
interface DateRange {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
}

// 2. Props の型定義
interface PeriodCtrlProps {
  startYear: number;
  endYear: number;
  dateSpan: DateRange;
  isMonth: boolean;
  // 更新時は { dateSpan: 新しいデータ } という形式で渡す
  onChange: (newSpanObj: { dateSpan: DateRange }) => void;
}

export const PeriodCtrl = ({
  startYear,
  endYear,
  dateSpan,
  isMonth,
  onChange,
}: PeriodCtrlProps) => {
  return (
    <PanelBody
      title={__("Period Setting", "block-collections")}
      initialOpen={true}
      className="form_setteing_ctrl"
    >
      <label>{__("Start of period", "block-collections")}</label>
      <PanelRow className="itmar_date_span">
        <NumberControl
          label={__("Year", "block-collections")}
          labelPosition="side"
          max={endYear}
          min={startYear}
          onChange={(newValue) => {
            const newSpanObj = {
              dateSpan: {
                ...dateSpan,
                startYear: Number(newValue),
              },
            };
            onChange(newSpanObj);
          }}
          value={dateSpan.startYear}
        />
        {isMonth && (
          <NumberControl
            label={__("Month", "block-collections")}
            labelPosition="side"
            max={12}
            min={1}
            onChange={(newValue) => {
              const newSpanObj = {
                dateSpan: {
                  ...dateSpan,
                  startMonth: Number(newValue),
                },
              };
              onChange(newSpanObj);
            }}
            value={dateSpan.startMonth}
          />
        )}
      </PanelRow>
      <label>{__("End of period", "block-collections")}</label>
      <PanelRow className="itmar_date_span">
        <NumberControl
          label={__("Year", "block-collections")}
          labelPosition="side"
          max={endYear}
          min={startYear}
          onChange={(newValue) => {
            const newSpanObj = {
              dateSpan: {
                ...dateSpan,
                endYear: Number(newValue),
              },
            };
            onChange(newSpanObj);
          }}
          value={dateSpan.endYear}
        />
        <NumberControl
          label={__("Month", "block-collections")}
          labelPosition="side"
          max={12}
          min={1}
          onChange={(newValue) => {
            const newSpanObj = {
              dateSpan: {
                ...dateSpan,
                endMonth: Number(newValue),
              },
            };
            onChange(newSpanObj);
          }}
          value={dateSpan.endMonth}
        />
      </PanelRow>
    </PanelBody>
  );
};

//日付から期間のクエリー用の配列を生成
// 1. 戻り値となるクエリオブジェクトの型定義
interface PeriodQuery {
  after: string;
  before: string;
}
export const getPeriodQuery = (
  dateString: string | undefined | null,
): PeriodQuery | null => {
  if (!dateString) {
    return null; //与えられた文字列が空ならnullをかえす
  }
  const parts = dateString.split("/");

  // 1. 年は必須。取れない場合は null を返す
  const year = parts[0] ? parseInt(parts[0], 10) : null;
  if (year === null || isNaN(year)) return null;

  // 2. 月と日を「数値」または「undefined」として安全に抽出
  // NaN を避けるために、条件式で厳密にチェックします
  const month =
    parts.length > 1 && !isNaN(parseInt(parts[1], 10))
      ? parseInt(parts[1], 10)
      : undefined;

  const day =
    parts.length > 2 && !isNaN(parseInt(parts[2], 10))
      ? parseInt(parts[2], 10)
      : undefined;

  let startDate: Date;
  let endDate: Date;

  // 3. 判定ロジック（undefined を使った方が TS の相性が良いです）
  if (month !== undefined && day !== undefined) {
    startDate = new Date(year, month - 1, day, 0, 0, 0, -1);
    endDate = new Date(year, month - 1, day, 23, 59, 59, 1000);
  } else if (month !== undefined) {
    startDate = new Date(year, month - 1, 1, 0, 0, 0, -1);
    endDate = new Date(year, month, 1, 0, 0, 0, 0);
  } else {
    startDate = new Date(year, 0, 1, 0, 0, 0, -1);
    endDate = new Date(year + 1, 0, 1, 0, 0, 0, 0);
  }

  return {
    after: startDate.toISOString(),
    before: endDate.toISOString(),
  };
};

//本日の日付から'YYYY/MM'形式の日付文字列を生成する
export const getTodayYearMonth = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}/${month}`;
};
//本日の日付から年を返す
export const getTodayYear = () => {
  const today = new Date();
  return today.getFullYear();
};
//本日の日付から月を返す
export const getTodayMonth = () => {
  const today = new Date();
  return today.getMonth() + 1;
};

// 1. 戻り値の型（インターフェース）を定義
interface MonthRange {
  ym: string; // "2026-01"
  from: string; // "2026-01-01"
  to: string; // "2026-01-31"
  year: number;
  month: number;
  lastDay: number;
}

const pad2 = (n: number | string): string => String(n).padStart(2, "0");

export const getMonthRangeYmd = (
  selectedMonth: string | undefined | null,
): MonthRange => {
  // 初期値（エラー時や未選択時）
  const defaultRange: MonthRange = {
    ym: "",
    from: "",
    to: "",
    year: 0,
    month: 0,
    lastDay: 0,
  };

  if (!selectedMonth) return defaultRange;

  const [yStr, mStr] = String(selectedMonth).split("/");
  const year = Number(yStr);
  const month = Number(mStr);

  // 2. NaN チェックを含めたガード
  if (isNaN(year) || isNaN(month) || year === 0 || month === 0) {
    return defaultRange;
  }

  // その月の「0日目」を指定することで、前月の最終日（＝今月の末日）を取得
  const lastDay = new Date(year, month, 0).getDate();
  const mm = pad2(month);
  return {
    ym: `${year}-${mm}`,
    from: `${year}-${mm}-01`,
    to: `${year}-${mm}-${pad2(lastDay)}`,
    year,
    month,
    lastDay,
  };
};

export const normalizeDateYYYYMMDD = (value: string) => {
  // 期待値: 'YYYY-MM-DD'
  if (!value) return "";
  return String(value).slice(0, 10);
};

/**
 * 様々な形式の「日」の入力と「選択された月」を組み合わせて YYYY-MM-DD 形式を返す
 */
export const toYmdFromMonthAndDay = (
  selectedMonth: string | undefined | null,
  dayValue: string | number | undefined | null,
): string => {
  if (!dayValue) return "";

  const dayStr = String(dayValue).trim();

  // already "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dayStr)) return dayStr;

  // 8 digits "YYYYMMDD"
  if (/^\d{8}$/.test(dayStr)) {
    const y = dayStr.slice(0, 4);
    const m = dayStr.slice(4, 6);
    const d = dayStr.slice(6, 8);
    return `${y}-${m}-${d}`;
  }
  // day-of-month number
  const dayNum = Number(dayStr);
  if (!selectedMonth || !dayNum) return "";
  const [yStr, mStr] = String(selectedMonth).split("/");
  if (!yStr || !mStr) return "";
  return `${yStr}-${pad2(Number(mStr))}-${pad2(dayNum)}`;
};

/* ------------------------------
カレンダー用グリッドAreasの生成関数
------------------------------ */
const WEEK_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * カレンダーの grid-template-areas 用の文字列を生成する
 * @param firstDayOfMonth 月の最初の日の曜日番号 (0:日, 1:月...)
 * @param totalDays 月の総日数 (28-31)
 * @param isMonday 月曜始まりにするかどうか
 */
export const generateGridAreas = (
  firstDayOfMonth: number,
  totalDays: number,
  isMonday: boolean,
): string => {
  let areas = [];
  let currentDay = 1;
  //月曜日を先頭に持ってくる場合の係数
  const mondayFirstDay = firstDayOfMonth - 1 < 0 ? 6 : firstDayOfMonth - 1;
  //先頭曜日の選択
  const modifyFirstDay = isMonday ? mondayFirstDay : firstDayOfMonth;

  //曜日ラベル
  let weekLabels = [];
  let week_index;
  for (let i = 0; i < 7; i++) {
    week_index = isMonday ? i + 1 : i; //月曜日を先頭に持ってくる場合の補正
    if (week_index > 6) week_index = 0;
    weekLabels.push(WEEK_NAMES[week_index]);
  }
  areas.push(weekLabels.join(" "));

  for (let i = 0; i < 6; i++) {
    // 6週分のループ
    let week = [];
    for (let j = 0; j < 7; j++) {
      // 1週間の7日分のループ
      if ((i === 0 && j < modifyFirstDay) || currentDay > totalDays) {
        week.push(`empty${i}`);
      } else {
        week.push(`day${currentDay}`);
        currentDay++;
      }
    }
    if (i == 5) {
      //最後の週
      week[5] = "day_clear";
      week[6] = "day_clear";
    }
    areas.push(week.join(" "));
  }
  return areas.map((week) => `"${week}"`).join("\n");
};
