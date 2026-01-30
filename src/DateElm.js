import { __ } from "@wordpress/i18n";
import { nanoid } from "nanoid";
import {
  PanelBody,
  PanelRow,
  __experimentalNumberControl as NumberControl,
} from "@wordpress/components";

//Google Calender APIから祝日データを取得するためのID
const CALENDAR_ID = "japanese__ja@holiday.calendar.google.com";

//期間の設定から選択できる月の情報オブジェクトを配列にする関数
export const generateDateArray = (dateObj, isMonth) => {
  const { startYear, startMonth, endYear, endMonth } = dateObj;
  const result = [];

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
export const generateMonthCalendar = (dateString, holidays = null) => {
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
export const PeriodCtrl = ({
  startYear,
  endYear,
  dateSpan,
  isMonth,
  onChange,
}) => {
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
export const getPeriodQuery = (dateString) => {
  if (!dateString) {
    return null; //与えられた文字列が空ならnullをかえす
  }
  const parts = dateString.split("/");
  const year = parseInt(parts[0], 10);
  const month = parts.length > 1 ? parseInt(parts[1], 10) : null;
  const day = parts.length > 2 ? parseInt(parts[2], 10) : null;

  let startDate, endDate;

  if (day) {
    // 特定の日
    startDate = new Date(year, month - 1, day, 0, 0, 0, -1);
    endDate = new Date(year, month - 1, day, 23, 59, 59, 1000);
  } else if (month) {
    // 特定の月
    startDate = new Date(year, month - 1, 1, 0, 0, 0, -1);
    endDate = new Date(year, month, 1, 0, 0, 0, 0);
  } else {
    // 特定の年
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

// "2026/01" -> { ym:"2026-01", from:"2026-01-01", to:"2026-01-31", year:2026, month:1 }
const pad2 = (n) => String(n).padStart(2, "0");
export const getMonthRangeYmd = (selectedMonth) => {
  if (!selectedMonth)
    return { ym: "", from: "", to: "", year: 0, month: 0, lastDay: 0 };
  const [yStr, mStr] = String(selectedMonth).split("/");
  const year = Number(yStr);
  const month = Number(mStr);
  if (!year || !month)
    return { ym: "", from: "", to: "", year: 0, month: 0, lastDay: 0 };

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

export const normalizeDateYYYYMMDD = (value) => {
  // 期待値: 'YYYY-MM-DD'
  if (!value) return "";
  return String(value).slice(0, 10);
};

export const toYmdFromMonthAndDay = (selectedMonth, dayValue) => {
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
const week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export const generateGridAreas = (firstDayOfMonth, totalDays, isMonday) => {
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
    weekLabels.push(week[week_index]);
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
