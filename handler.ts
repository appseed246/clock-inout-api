"use strict";
import { Handler } from "aws-lambda";
import * as puppeteer from "puppeteer-core";
import * as chromium from "chrome-aws-lambda";
import "source-map-support/register";
import "reflect-metadata";
import { sample } from "./sample";
import { Operator } from "./Operator";
import { executeClockOut, executeClockIn } from "./Scenario";

const userId = process.env.USERID;
const password = process.env.PASSWORD;

const getOperator = async () => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless
  });
  return new Operator(browser);
};

export const hello: Handler = async () => {
  const result = await sample();
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};

export const clockout: Handler = async () => {
  const operator = await getOperator();
  const result = await executeClockOut(operator, userId!, password!);
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};

export const clockin: Handler = async () => {
  const operator = await getOperator();
  const result = await executeClockIn(operator, userId!, password!);
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
};
