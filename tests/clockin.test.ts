import { executeClockin } from "../Scenario";
import * as puppeteer from "puppeteer";
import { Operator } from "../Operator";

// usage: ts-node clockin.test.ts <userID> <password>
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const op = new Operator(browser);
  await executeClockin(op, process.argv[2], process.argv[3]);
})().then(() => {
  return;
});
