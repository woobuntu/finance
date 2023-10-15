import { isNumber, isString } from "lodash-es";

type NestException = {
  response: {
    data: {
      error: string;
      message: string;
      statusCode: number;
    };
  };
};

export const isNestException = (error: any): error is NestException => {
  return (
    error?.response?.data?.error &&
    isString(error?.response?.data?.error) &&
    error?.response?.data?.message &&
    isString(error?.response?.data?.message) &&
    error?.response?.data?.statusCode &&
    isNumber(error?.response?.data?.statusCode)
  );
};
