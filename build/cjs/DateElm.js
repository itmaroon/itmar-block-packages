'use strict';

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');
var i18n = require('@wordpress/i18n');
var index = require('./node_modules/nanoid/non-secure/index.js');
var components = require('@wordpress/components');

//期間の設定から選択できる月の情報オブジェクトを配列にする関数
var generateDateArray = (dateObj, isMonth) => {
  var {
    startYear,
    startMonth,
    endYear,
    endMonth
  } = dateObj;
  var result = [];
  for (var year = startYear; year <= endYear; year++) {
    if (isMonth) {
      var monthStart = year === startYear ? startMonth : 1;
      var monthEnd = year === endYear ? endMonth : 12;
      for (var month = monthStart; month <= monthEnd; month++) {
        var unitObj = {
          id: index.nanoid(5),
          value: "".concat(year, "/").concat(month.toString().padStart(2, "0")),
          label: "".concat(year, "/").concat(month.toString().padStart(2, "0")),
          classname: "filter_date"
        };
        result.push(unitObj);
      }
    } else {
      var _unitObj = {
        id: index.nanoid(5),
        value: "".concat(year),
        label: "".concat(year),
        classname: "filter_date"
      };
      result.push(_unitObj);
    }
  }
  return result;
};

//与えられた月から日付と曜日を要素とする配列を生成する
var generateMonthCalendar = function generateMonthCalendar(dateString) {
  var holidays = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var [year, month] = dateString.split("/").map(Number);
  var date = new Date(year, month - 1, 1);
  var lastDay = new Date(year, month, 0).getDate();
  var calendar = [];
  var _loop = function _loop(day) {
    date.setDate(day);
    //祝日の情報
    var holidayItem = holidays === null || holidays === void 0 ? void 0 : holidays.find(item => {
      var _item$date;
      var s = String((_item$date = item.date) !== null && _item$date !== void 0 ? _item$date : "");

      // item.date から YYYY, MM, DD を取り出す（"YYYYMMDD" / "YYYY-MM-DD" などに対応）
      var yearStr = s.slice(0, 4);
      var monthStr = s.replace(/\D/g, "").slice(4, 6); // 数字だけにして5-6桁
      var dayStr = s.replace(/\D/g, "").slice(6, 8); // 数字だけにして7-8桁

      var itemYear = Number(yearStr);
      var itemMonth = Number(monthStr);
      var itemDay = Number(dayStr);
      return itemYear === year && itemMonth === month && itemDay === day;
    });
    //日付情報オブジェクト
    var dayObj = holidayItem ? {
      date: day,
      weekday: date.getDay(),
      holiday: holidayItem.name
    } : {
      date: day,
      weekday: date.getDay()
    };
    calendar.push(dayObj);
  };
  for (var day = 1; day <= lastDay; day++) {
    _loop(day);
  }
  return calendar;
};

//期間設定のインスペクターコントロール
var PeriodCtrl = _ref => {
  var {
    startYear,
    endYear,
    dateSpan,
    isMonth,
    onChange: _onChange
  } = _ref;
  return /*#__PURE__*/React.createElement(components.PanelBody, {
    title: i18n.__("Period Setting", "block-collections"),
    initialOpen: true,
    className: "form_setteing_ctrl"
  }, /*#__PURE__*/React.createElement("label", null, i18n.__("Start of period", "block-collections")), /*#__PURE__*/React.createElement(components.PanelRow, {
    className: "itmar_date_span"
  }, /*#__PURE__*/React.createElement(components.__experimentalNumberControl, {
    label: i18n.__("Year", "block-collections"),
    labelPosition: "side",
    max: endYear,
    min: startYear,
    onChange: newValue => {
      var newSpanObj = {
        dateSpan: _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, dateSpan), {}, {
          startYear: Number(newValue)
        })
      };
      _onChange(newSpanObj);
    },
    value: dateSpan.startYear
  }), isMonth && /*#__PURE__*/React.createElement(components.__experimentalNumberControl, {
    label: i18n.__("Month", "block-collections"),
    labelPosition: "side",
    max: 12,
    min: 1,
    onChange: newValue => {
      var newSpanObj = {
        dateSpan: _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, dateSpan), {}, {
          startMonth: Number(newValue)
        })
      };
      _onChange(newSpanObj);
    },
    value: dateSpan.startMonth
  })), /*#__PURE__*/React.createElement("label", null, i18n.__("End of period", "block-collections")), /*#__PURE__*/React.createElement(components.PanelRow, {
    className: "itmar_date_span"
  }, /*#__PURE__*/React.createElement(components.__experimentalNumberControl, {
    label: i18n.__("Year", "block-collections"),
    labelPosition: "side",
    max: endYear,
    min: startYear,
    onChange: newValue => {
      var newSpanObj = {
        dateSpan: _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, dateSpan), {}, {
          endYear: Number(newValue)
        })
      };
      _onChange(newSpanObj);
    },
    value: dateSpan.endYear
  }), /*#__PURE__*/React.createElement(components.__experimentalNumberControl, {
    label: i18n.__("Month", "block-collections"),
    labelPosition: "side",
    max: 12,
    min: 1,
    onChange: newValue => {
      var newSpanObj = {
        dateSpan: _rollupPluginBabelHelpers.objectSpread2(_rollupPluginBabelHelpers.objectSpread2({}, dateSpan), {}, {
          endMonth: Number(newValue)
        })
      };
      _onChange(newSpanObj);
    },
    value: dateSpan.endMonth
  })));
};

//日付から期間のクエリー用の配列を生成
var getPeriodQuery = dateString => {
  if (!dateString) {
    return null; //与えられた文字列が空ならnullをかえす
  }
  var parts = dateString.split("/");
  var year = parseInt(parts[0], 10);
  var month = parts.length > 1 ? parseInt(parts[1], 10) : null;
  var day = parts.length > 2 ? parseInt(parts[2], 10) : null;
  var startDate, endDate;
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
    before: endDate.toISOString()
  };
};

//本日の日付から'YYYY/MM'形式の日付文字列を生成する
var getTodayYearMonth = () => {
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  return "".concat(year, "/").concat(month);
};
//本日の日付から年を返す
var getTodayYear = () => {
  var today = new Date();
  return today.getFullYear();
};
//本日の日付から月を返す
var getTodayMonth = () => {
  var today = new Date();
  return today.getMonth() + 1;
};

// "2026/01" -> { ym:"2026-01", from:"2026-01-01", to:"2026-01-31", year:2026, month:1 }
var pad2 = n => String(n).padStart(2, "0");
var getMonthRangeYmd = selectedMonth => {
  if (!selectedMonth) return {
    ym: "",
    from: "",
    to: "",
    year: 0,
    month: 0,
    lastDay: 0
  };
  var [yStr, mStr] = String(selectedMonth).split("/");
  var year = Number(yStr);
  var month = Number(mStr);
  if (!year || !month) return {
    ym: "",
    from: "",
    to: "",
    year: 0,
    month: 0,
    lastDay: 0
  };
  var lastDay = new Date(year, month, 0).getDate();
  var mm = pad2(month);
  return {
    ym: "".concat(year, "-").concat(mm),
    from: "".concat(year, "-").concat(mm, "-01"),
    to: "".concat(year, "-").concat(mm, "-").concat(pad2(lastDay)),
    year,
    month,
    lastDay
  };
};
var normalizeDateYYYYMMDD = value => {
  // 期待値: 'YYYY-MM-DD'
  if (!value) return "";
  return String(value).slice(0, 10);
};
var toYmdFromMonthAndDay = (selectedMonth, dayValue) => {
  if (!dayValue) return "";
  var dayStr = String(dayValue).trim();

  // already "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(dayStr)) return dayStr;

  // 8 digits "YYYYMMDD"
  if (/^\d{8}$/.test(dayStr)) {
    var y = dayStr.slice(0, 4);
    var m = dayStr.slice(4, 6);
    var d = dayStr.slice(6, 8);
    return "".concat(y, "-").concat(m, "-").concat(d);
  }
  // day-of-month number
  var dayNum = Number(dayStr);
  if (!selectedMonth || !dayNum) return "";
  var [yStr, mStr] = String(selectedMonth).split("/");
  if (!yStr || !mStr) return "";
  return "".concat(yStr, "-").concat(pad2(Number(mStr)), "-").concat(pad2(dayNum));
};

/* ------------------------------
カレンダー用グリッドAreasの生成関数
------------------------------ */
var week = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
var generateGridAreas = (firstDayOfMonth, totalDays, isMonday) => {
  var areas = [];
  var currentDay = 1;
  //月曜日を先頭に持ってくる場合の係数
  var mondayFirstDay = firstDayOfMonth - 1 < 0 ? 6 : firstDayOfMonth - 1;
  //先頭曜日の選択
  var modifyFirstDay = isMonday ? mondayFirstDay : firstDayOfMonth;

  //曜日ラベル
  var weekLabels = [];
  var week_index;
  for (var i = 0; i < 7; i++) {
    week_index = isMonday ? i + 1 : i; //月曜日を先頭に持ってくる場合の補正
    if (week_index > 6) week_index = 0;
    weekLabels.push(week[week_index]);
  }
  areas.push(weekLabels.join(" "));
  for (var _i = 0; _i < 6; _i++) {
    // 6週分のループ
    var _week = [];
    for (var j = 0; j < 7; j++) {
      // 1週間の7日分のループ
      if (_i === 0 && j < modifyFirstDay || currentDay > totalDays) {
        _week.push("empty".concat(_i));
      } else {
        _week.push("day".concat(currentDay));
        currentDay++;
      }
    }
    if (_i == 5) {
      //最後の週
      _week[5] = "day_clear";
      _week[6] = "day_clear";
    }
    areas.push(_week.join(" "));
  }
  return areas.map(week => "\"".concat(week, "\"")).join("\n");
};

exports.PeriodCtrl = PeriodCtrl;
exports.generateDateArray = generateDateArray;
exports.generateGridAreas = generateGridAreas;
exports.generateMonthCalendar = generateMonthCalendar;
exports.getMonthRangeYmd = getMonthRangeYmd;
exports.getPeriodQuery = getPeriodQuery;
exports.getTodayMonth = getTodayMonth;
exports.getTodayYear = getTodayYear;
exports.getTodayYearMonth = getTodayYearMonth;
exports.normalizeDateYYYYMMDD = normalizeDateYYYYMMDD;
exports.toYmdFromMonthAndDay = toYmdFromMonthAndDay;
//# sourceMappingURL=DateElm.js.map
