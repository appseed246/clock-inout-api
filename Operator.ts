import { Browser, Page } from "puppeteer-core";

/**
 * ネットde顧問のコンテンツ
 * + paycheck: ネットde明細
 * + attendance: ネットde就業
 * + regulation: ネットde規則
 * + schedule: ネットdeスケジュール
 */
type Content = "paycheck" | "attendance" | "regulation" | "schedule";

export class Operator {
  // ログインページのURL
  private readonly LOGIN_PAGE_URL = "https://www1.shalom-house.jp/komon/";
  // Contentの文字列に対応するボタンのID
  private readonly selectors: { [k in Content]: string } = {
    paycheck: "#ctl00_ContentPlaceHolder1_imgBtnMeisai",
    attendance: "#ctl00_ContentPlaceHolder1_imgBtnSyuugyou",
    regulation: "#ctl00_ContentPlaceHolder1_imgBtnKisoku",
    schedule: "#ctl00_ContentPlaceHolder1_imgBtnGrp"
  };

  private readonly attendanceSelector: { [key: string]: string } = {
    clockin: "#ctl00_ContentPlaceHolder1_ibtnIn4",
    clockout: "#ctl00_ContentPlaceHolder1_ibtnOut4"
  };
  // ブラウザの操作を行うオブジェクト
  // puppeteerによって生成
  private page: Page;

  // アクセス失敗時のリトライカウント
  private retryCount: number = 0;
  private readonly RETRY_LIMIT: number = 3;
  /**
   * コンストラクタ
   */
  constructor(private browser: Browser) {
    // console.log(this.browser);
  }
  /**
   * ログインする
   * @param {string} userID ユーザID
   * @param {string} password パスワード
   * @returns {boolean} ログインに成功した場合はtrue, それ以外はfalse
   */
  public async login(userID: string, password: string): Promise<boolean> {
    try {
      // 新しいページを生成し、ログインページに遷移する
      this.page = await this.browser.newPage();
      await this.page.goto(this.LOGIN_PAGE_URL);

      // ID,パスワード入力
      await this.page.type("#txtID", userID);
      await this.page.type("#txtPsw", password);

      // ログインボタン押下
      await Promise.all([
        this.page.click("#btnLogin"),
        this.page.waitForNavigation({
          timeout: 10000,
          waitUntil: "networkidle0"
        })
      ]);
    } catch (e) {
      console.log(e);
      if (this.retryCount == this.RETRY_LIMIT) {
        console.log("retry exceeded.");
        return false;
      }
      await this.page.close();
      await this.page.waitFor(1000);
      console.log("login retry.");
      this.retryCount++;
      await this.login(userID, password);
    }
    this.retryCount = 0;
    return true;
  }
  /**
   * 指定したコンテンツにアクセスする
   * @param {Content} content
   */
  public async accessContent(content: Content): Promise<boolean> {
    try {
      const selector = this.getContentSelector(content);
      await Promise.all([
        this.page.click(selector),
        this.page.waitForNavigation({
          timeout: 10000,
          waitUntil: "domcontentloaded"
        })
      ]);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }
  /**
   * 出社ボタンを押下する。
   */
  public async clockin(): Promise<boolean> {
    return this.pushAttendanceButton("clockin");
  }
  /**
   * 退社ボタンを押下する。
   */
  public async clockout(): Promise<boolean> {
    return this.pushAttendanceButton("clockout");
  }

  private async pushAttendanceButton(command: "clockin" | "clockout") {
    try {
      const selector = this.getAttendanceSelector(command);
      const button = await this.page.$(selector);
      if (button == null) {
        console.log(`"${selector}" does not exist.`);
        return false;
      }

      // ボタン押下
      await Promise.all([
        button.click(),
        this.page.waitForNavigation({
          timeout: 10000,
          waitUntil: "networkidle0"
        })
      ]);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }

  /**
   * アクセスするコンテンツに応じたHTMLElementのセレクターを取得する。
   * @param content アクセスするコンテンツ
   */
  private getContentSelector(content: Content): string {
    return this.selectors[content];
  }

  /**
   * 出社・退社ボタンのセレクターを取得する。
   * @param command 出社 or 退社
   */
  private getAttendanceSelector(command: "clockin" | "clockout") {
    return this.attendanceSelector[command];
  }
}
