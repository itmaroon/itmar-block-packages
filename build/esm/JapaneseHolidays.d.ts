declare global {
    interface Window {
        gapi: any;
    }
}
export declare const JapaneseHolidays: (apiKey: string, targetMonth: string) => Promise<any>;
