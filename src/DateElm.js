import { __ } from "@wordpress/i18n";
import { nanoid } from "nanoid";
import {
  PanelBody,
  PanelRow,
  __experimentalNumberControl as NumberControl,
} from "@wordpress/components";

import { useRef, useEffect, useState } from "@wordpress/element";

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
      // 日付文字列から最後の2桁を抽出
      const lastTwoDigits = parseInt(item.date.slice(-2), 10);
      // 抽出した2桁を比較
      return lastTwoDigits === day;
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

export const JapaneseHolidays = async (apiKey, targetMonth) => {
  //Google API Client Libraryをプロジェクトに追加する(非同期で読み込み)
  const loadGoogleAPI = () => {
    return new Promise((resolve, reject) => {
      //window.gapi の存在を直接チェック
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      //スクリプトがロードされたときのイベントハンドラ
      script.onload = () => {
        // gapiがロードされるまでチェックを繰り返す
        const checkGapi = () => {
          if (window.gapi) {
            resolve();
          } else {
            setTimeout(checkGapi, 20); // Check again after 20ms
          }
        };
        checkGapi();
      };

      script.onerror = () =>
        reject(new Error("Failed to load Google API script"));

      // Check if the script is already in the document
      if (
        !document.querySelector(
          'script[src="https://apis.google.com/js/api.js"]'
        )
      ) {
        document.body.appendChild(script);
      }
    });
  };
  //APIキーを使用してクライアントを初期化する
  const initClient = async () => {
    if (!window.gapi) {
      throw new Error("Google API not loaded");
    }

    // Check if gapi.client is already available
    if (!window.gapi.client) {
      // If not, load the client module
      await new Promise((resolve) => window.gapi.load("client", resolve));
    }

    if (window.gapi.client.calendar) {
      return;
    }
    await window.gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
      ],
    });
  };
  //祝日データの取得
  const fetchHolidays = async () => {
    const periodObj = getPeriodQuery(targetMonth);

    const response = await window.gapi.client.calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: periodObj.after,
      timeMax: periodObj.before,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.result.items;
    return events.map((event) => ({
      date: event.start.date,
      name: event.summary,
    }));
  };

  try {
    await loadGoogleAPI();
    await initClient();
    return await fetchHolidays();
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error;
  }
};
