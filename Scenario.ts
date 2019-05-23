import { Operator } from "./Operator";

export const executeClockin = async (
  operator: Operator,
  userId: string,
  password: string
): Promise<boolean> => {
  await operator.login(userId, password);

  return true;
};
