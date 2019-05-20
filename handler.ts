"use strict";
import { Handler } from "aws-lambda";
import "source-map-support/register";
import "reflect-metadata";
import { sample } from "./sample";

export const hello: Handler = async () => {
  const result = await sample();
  return {
    statusCode: 200,
    body: JSON.stringify({ result })
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
