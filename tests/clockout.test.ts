import { executeClockOut } from "../Scenario";
import * as puppeteer from "puppeteer";
import { Operator } from "../Operator";

// usage: ts-node clockout.test.ts <userID> <password>
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  const op = new Operator(browser);
  const result = await executeClockOut(op, process.argv[2], process.argv[3]);
  console.log(JSON.stringify(result));
})().then(() => {
  return;
});
