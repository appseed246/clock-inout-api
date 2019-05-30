import { Operator } from "./Operator";
import { Result } from "./Types";

export const executeClockOut = async (
  operator: Operator,
  userId: string,
  password: string
): Promise<Result> => {
  try {
    if (!(await operator.login(userId, password))) {
      console.log("login failed.");
      return operator.result;
    }

    if (!(await operator.accessContent("attendance"))) {
      console.log("content select failed.");
      return operator.result;
    }

    if (!(await operator.clockout())) {
      console.log("clockout failed.");
      return operator.result;
    }
  } catch (e) {
    console.log("undefined error.", e);
    return {
      status: "NG",
      message: "undefined error."
    };
  }

  return operator.result;
};

export const executeClockIn = async (
  operator: Operator,
  userId: string,
  password: string
): Promise<Result> => {
  try {
    if (!(await operator.login(userId, password))) {
      console.log("login failed.");
      return operator.result;
    }

    if (!(await operator.accessContent("attendance"))) {
      console.log("content select failed.");
      return operator.result;
    }

    if (!(await operator.clockin())) {
      console.log("clockin failed.");
      return operator.result;
    }
  } catch (e) {
    console.log("undefined error.", e);
    return {
      status: "NG",
      message: "undefined error."
    };
  }

  return operator.result;
};
