/**
 * ネットde顧問のコンテンツ
 * + paycheck: ネットde明細
 * + attendance: ネットde就業
 * + regulation: ネットde規則
 * + schedule: ネットdeスケジュール
 */
export type Content = "paycheck" | "attendance" | "regulation" | "schedule";

/**
 * 勤怠画面で実行可能なコマンド
 * + clockin: 出勤ボタン押下
 * + clockout: 退勤ボタン押下
 * + goout: 外出ボタン押下
 * + return: 戻りボタン押下
 */
export type AttendanceCommand = "clockin" | "clockout" | "goout" | "return";

export interface RetryOption {
  retryLimit?: number;
  waitMilliSecond?: number;
  pageClose?: boolean;
}

type OKResult = {
  status: "OK";
  message?: string;
};

type NGResult = {
  status: "NG";
  message: string;
};

export type Result = OKResult | NGResult;

/**
 * 出勤ステータス
 * + before: 出勤前
 * + working: 勤務中
 * + out: 外出中
 * + leave: 退社済み
 */
export type Status = "before" | "working" | "out" | "leave";
