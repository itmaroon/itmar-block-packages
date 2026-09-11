/**
 * カレンダーの grid-template-areas 生成。
 *
 * 【重要】このモジュールは @wordpress パッケージに依存しない。ビュースクリプトから
 * 参照されるため、依存を足すとエディタ用パッケージがフロントエンドへ配信される。
 * 以前は DateElm.tsx（日付コントロールUI）に同居していた。
 */
const WEEK_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
/**
 * カレンダーの grid-template-areas 用の文字列を生成する
 * @param firstDayOfMonth 月の最初の日の曜日番号 (0:日, 1:月...)
 * @param totalDays その月の日数
 * @param isMonday 月曜始まりにするかどうか
 */
const generateGridAreas = (firstDayOfMonth, totalDays, isMonday) => {
    const areas = [];
    let currentDay = 1;
    //月曜日を先頭に持ってくる場合の係数
    const mondayFirstDay = firstDayOfMonth - 1 < 0 ? 6 : firstDayOfMonth - 1;
    //先頭曜日の選択
    const modifyFirstDay = isMonday ? mondayFirstDay : firstDayOfMonth;
    //曜日ラベル
    const weekLabels = [];
    let week_index;
    for (let i = 0; i < 7; i++) {
        week_index = isMonday ? i + 1 : i; //月曜日を先頭に持ってくる場合の補正
        if (week_index > 6)
            week_index = 0;
        weekLabels.push(WEEK_NAMES[week_index]);
    }
    areas.push(weekLabels.join(" "));
    for (let i = 0; i < 6; i++) {
        // 6週分のループ
        const week = [];
        for (let j = 0; j < 7; j++) {
            // 1週間の7日分のループ
            if ((i === 0 && j < modifyFirstDay) || currentDay > totalDays) {
                week.push(`empty${i}`);
            }
            else {
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

export { generateGridAreas };
//# sourceMappingURL=gridAreas.js.map
