import { Operator } from "./Operator";

export const executeClockin = async (
  operator: Operator,
  userId: string,
  password: string
): Promise<boolean> => {
  if (!(await operator.login(userId, password))) {
    console.log("login failed.");
    return false;
  }

  if (!(await operator.accessContent("attendance"))) {
    console.log("content select failed.");
    return false;
  }

  return true;
};
