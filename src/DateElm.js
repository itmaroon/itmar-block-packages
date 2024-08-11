import { __ } from "@wordpress/i18n";
import { nanoid } from "nanoid";
import {
  PanelBody,
  PanelRow,
  __experimentalNumberControl as NumberControl,
} from "@wordpress/components";
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
export const generateMonthCalendar = (dateString) => {
  const [year, month] = dateString.split("/").map(Number);
  const date = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0).getDate();

  const calendar = [];

  for (let day = 1; day <= lastDay; day++) {
    date.setDate(day);
    calendar.push({
      date: day,
      weekday: date.getDay(),
    });
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
export const getTodayYear = () => {
  const today = new Date();
  return today.getFullYear();
};
export const getTodayMonth = () => {
  const today = new Date();
  return today.getMonth() + 1;
};
