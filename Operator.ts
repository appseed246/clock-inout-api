import { Browser, Page, NavigationOptions } from "puppeteer-core";
import { Content, AttendanceCommand, Result, RetryOption } from "./Types";

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

  // 関数の実行結果
  // エラー情報などを含む
  private _error: Result = { status: "OK" };

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
    const result = await this.doRetry(
      async () => {
        await this.doLogin(userID, password);
      },
      { pageClose: true }
    );
    if (!result) {
      this.result = {
        status: "NG",
        message: "failed to login."
      };
      return false;
    }
    return true;
  }
  /**
   * 指定したコンテンツにアクセスする
   * @param {Content} content
   */
  public async accessContent(content: Content): Promise<boolean> {
    try {
      const selector = this.getContentSelector(content);
      await this.clickWithWait(selector, {
        timeout: 10000,
        waitUntil: "domcontentloaded"
      });
    } catch (e) {
      console.log(e);
      this.result = {
        status: "NG",
        message: `failed to access content:${content}`
      };
      return false;
    }
    return true;
  }
  /**
   * 出社ボタンを押下する。
   */
  public async clockin(): Promise<boolean> {
    try {
      if (!(await this.pushAttendanceButton("clockin"))) {
        this.result = {
          status: "OK",
          message: "you already has been clockin."
        };
        return true;
      }
    } catch (e) {
      console.log(e);
      this.result = {
        status: "NG",
        message: "failed to clockin."
      };
      return false;
    }
    return true;
  }
  /**
   * 退社ボタンを押下する。
   */
  public async clockout(): Promise<boolean> {
    try {
      if (!(await this.pushAttendanceButton("clockout"))) {
        this.result = {
          status: "OK",
          message: "you already has been clockout."
        };
        return true;
      }
    } catch (e) {
      console.log(e);
      this.result = {
        status: "NG",
        message: "failed to clockout."
      };
      return false;
    }
    return true;
  }

  /**
   * ログイン処理
   * @param userID ユーザID
   * @param password パスワード
   */
  private async doLogin(userID: string, password: string) {
    // 新しいページを生成し、ログインページに遷移する
    this.page = await this.browser.newPage();
    await this.page.goto(this.LOGIN_PAGE_URL);

    // ID,パスワード入力
    await this.page.type("#txtID", userID);
    await this.page.type("#txtPsw", password);

    // ログインボタン押下
    await this.clickWithWait("#btnLogin", {
      timeout: 10000,
      waitUntil: "networkidle0"
    });
  }

  /**
   * 引数で渡された関数を実行する。
   * fn実行時に例外が発生した場合、fnを再実行する。
   * @param fn 実行する関数
   * @param retryLimit リトライ上限回数(デフォルト 3回)
   * @param waitMilliSecond リトライ前の待機時間(ミリ秒) (デフォルト 1000ms)
   * @param pageClose 例外発生時にページをクローズするか。(デフォルト false)
   */
  private async doRetry(
    fn: () => Promise<any>,
    {
      retryLimit = 3,
      waitMilliSecond = 1000,
      pageClose = false
    }: Partial<RetryOption> = {}
  ): Promise<boolean> {
    for (let retryCount = 0; ; retryCount++) {
      try {
        await fn();
        // fn()が正常に実行できた場合
        return true;
      } catch (e) {
        console.log(e);
        // リトライ試行回数上限到達時
        if (retryCount == retryLimit) {
          console.log("retry exceeded.");
          return false;
        }
        if (pageClose) {
          await this.page.close();
        }
        await this.page.waitFor(waitMilliSecond);
        console.log("login retry.");
      }
    }
  }

  private async pushAttendanceButton(command: AttendanceCommand) {
    const selector = this.getAttendanceSelector(command);
    const button = await this.page.$(selector);
    if (button == null) {
      console.log(`'${command}' does not exist. maybe already push button.`);
      return false;
    }

    // ボタン押下
    await this.clickWithWait(selector, {
      timeout: 10000,
      waitUntil: "networkidle0"
    });
    return true;
  }

  /**
   * 引数に指定したセレクタの要素をクリックしページ遷移を待つ
   * @param selector 要素のセレクタ文字列
   * @param option waitForNavigationのオプション
   */
  private async clickWithWait(
    selector: string,
    option: NavigationOptions | undefined
  ) {
    return Promise.all([
      this.page.click(selector),
      this.page.waitForNavigation(option)
    ]);
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
   * @param command
   */
  private getAttendanceSelector(command: AttendanceCommand) {
    return this.attendanceSelector[command];
  }

  public get result(): Result {
    return this._error;
  }

  public set result(v: Result) {
    this._error = v;
  }
}
