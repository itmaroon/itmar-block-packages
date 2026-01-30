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
          'script[src="https://apis.google.com/js/api.js"]',
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
