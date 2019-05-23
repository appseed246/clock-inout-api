import { Browser, Page } from "puppeteer-core";

export class Operator {
  private readonly LOGIN_PAGE_URL = "https://www1.shalom-house.jp/komon/";
  private page: Page;

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
    this.page = await this.browser.newPage();
    await this.page.goto(this.LOGIN_PAGE_URL);

    // ID,パスワード入力
    await this.page.type("#txtID", userID);
    await this.page.type("#txtPsw", password);

    // ログインボタン押下
    await this.page.click("#btnLogin");
    return true;
  }
  /**
   * 指定したコンテンツにアクセスする
   * @param {"attendance"} content
   */
  public accessContent(_content: "attendance"): boolean {
    return true;
  }
  /**
   * 出社ボタンを押下する。
   */
  public clockin(): boolean {
    return true;
  }
  /**
   * 退社ボタンを押下する。
   */
  public clockout(): boolean {
    return true;
  }
}
