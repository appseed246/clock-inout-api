import { Status, AttendanceCommand } from "./Types";

export class AttendaceSelector {
  private status: Status;
  constructor(label: string | null) {
    // ラベルからステータスを判定する
    const status = Object.keys(this.statusLabel).reduce((acc, key) => {
      return key == label ? (key as Status) : acc;
    }, null);

    // 不正なラベルの場合例外をなげる
    if (status == null) {
      throw new Error(`invalid label: ${label}`);
    }
    this.status = status;
  }

  private readonly attendanceSelector: { [k in AttendanceCommand]: string } = {
    clockin: "#ctl00_ContentPlaceHolder1_ibtnIn",
    clockout: "#ctl00_ContentPlaceHolder1_ibtnOut",
    goout: "#ctl00_ContentPlaceHolder1_ibtnGoOut",
    return: "#ctl00_ContentPlaceHolder1_ibtnReturn"
  };

  private readonly statusNumber: { [k in Status]: number } = {
    before: 3,
    working: 4,
    out: 2,
    leave: 1
  };

  private readonly statusLabel: { [k in Status]: string } = {
    before: "出社前",
    working: "勤務中",
    out: "外出中",
    leave: "退社済み"
  };

  private readonly executableCommands: {
    [k in Status]: AttendanceCommand[]
  } = {
    before: ["clockin"],
    working: ["goout", "clockout"],
    out: ["return"],
    leave: []
  };

  public getSelectorByCommand(command: AttendanceCommand): string {
    const selector = this.attendanceSelector[command];
    const num = this.statusNumber[this.status];
    return `${selector}${num}`;
  }

  public canExecute(command: AttendanceCommand): boolean {
    // 現在の出勤ステータスで、引数で指定されたコマンドを実行できない場合false
    if (!this.executableCommands[this.status].includes(command)) {
      return false;
    }
    return true;
  }
}
