import * as chromium from "chrome-aws-lambda";
import * as puppeteer from "puppeteer-core";

// googleの検索結果のタイトルをすべて取得する
export const sample = async () => {
  let browser;
  let result = [];
  try {
    console.log("------------ start ------------");
    browser = await puppeteer.launch({
      // headless: false,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless
    });
    console.log("------------ newPage ------------");
    const page = await browser.newPage();

    console.log("------------ google ------------");
    await page.goto("https://www.google.com");
    await page.type("input[name='q']", "よもぎまる");

    console.log("------------ submit ------------");
    // 検索フォームのsubmit実行
    page.$eval("form[name='f']", elm => elm.submit());

    // ページ遷移待機
    console.log("------------ waiting ------------");
    await page.waitForNavigation();

    // 検索結果のページのタイトルをすべて取得
    const titleElms = await page.$$("#rso a>h3");
    for (const elem of titleElms) {
      const content = await elem.getProperty("innerHTML");
      result.push(await content.jsonValue());
    }
    console.log("------------ obtain ------------");
  } finally {
    if (browser != null) {
      await browser.close();
    }
  }
  // console.log(result);
  return result;
};
