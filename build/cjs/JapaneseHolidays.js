'use strict';

var _rollupPluginBabelHelpers = require('./_virtual/_rollupPluginBabelHelpers.js');

var JapaneseHolidays = /*#__PURE__*/function () {
  var _ref = _rollupPluginBabelHelpers.asyncToGenerator(function* (apiKey, targetMonth) {
    //Google API Client Libraryをプロジェクトに追加する(非同期で読み込み)
    var loadGoogleAPI = () => {
      return new Promise((resolve, reject) => {
        //window.gapi の存在を直接チェック
        if (window.gapi) {
          resolve();
          return;
        }
        var script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.defer = true;
        //スクリプトがロードされたときのイベントハンドラ
        script.onload = () => {
          // gapiがロードされるまでチェックを繰り返す
          var checkGapi = () => {
            if (window.gapi) {
              resolve();
            } else {
              setTimeout(checkGapi, 20); // Check again after 20ms
            }
          };
          checkGapi();
        };
        script.onerror = () => reject(new Error("Failed to load Google API script"));

        // Check if the script is already in the document
        if (!document.querySelector('script[src="https://apis.google.com/js/api.js"]')) {
          document.body.appendChild(script);
        }
      });
    };
    //APIキーを使用してクライアントを初期化する
    var initClient = /*#__PURE__*/function () {
      var _ref2 = _rollupPluginBabelHelpers.asyncToGenerator(function* () {
        if (!window.gapi) {
          throw new Error("Google API not loaded");
        }

        // Check if gapi.client is already available
        if (!window.gapi.client) {
          // If not, load the client module
          yield new Promise(resolve => window.gapi.load("client", resolve));
        }
        if (window.gapi.client.calendar) {
          return;
        }
        yield window.gapi.client.init({
          apiKey: apiKey,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
        });
      });
      return function initClient() {
        return _ref2.apply(this, arguments);
      };
    }();
    //祝日データの取得
    var fetchHolidays = /*#__PURE__*/function () {
      var _ref3 = _rollupPluginBabelHelpers.asyncToGenerator(function* () {
        var periodObj = getPeriodQuery(targetMonth);
        var response = yield window.gapi.client.calendar.events.list({
          calendarId: CALENDAR_ID,
          timeMin: periodObj.after,
          timeMax: periodObj.before,
          singleEvents: true,
          orderBy: "startTime"
        });
        var events = response.result.items;
        return events.map(event => ({
          date: event.start.date,
          name: event.summary
        }));
      });
      return function fetchHolidays() {
        return _ref3.apply(this, arguments);
      };
    }();
    try {
      yield loadGoogleAPI();
      yield initClient();
      return yield fetchHolidays();
    } catch (error) {
      console.error("エラーが発生しました:", error);
      throw error;
    }
  });
  return function JapaneseHolidays(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.JapaneseHolidays = JapaneseHolidays;
//# sourceMappingURL=JapaneseHolidays.js.map
