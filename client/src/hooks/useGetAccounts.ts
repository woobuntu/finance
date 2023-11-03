import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { axiosInstance } from "../axios";
import { RootAccounts } from "@prisma-custom-types";
import { isUndefined } from "lodash-es";

const getAccounts = async ({
  queryKey,
}: QueryFunctionContext<
  [string, { startDate: Date; endDate: Date; rootAccountName?: string }]
>) => {
  const [_key, { startDate, endDate, rootAccountName }] = queryKey;

  const { data } = await axiosInstance.get<RootAccounts>(
    isUndefined(rootAccountName)
      ? `/accounts?startDate=${startDate}&endDate=${endDate}`
      : `/accounts?startDate=${startDate}&endDate=${endDate}&rootAccountName=${rootAccountName}`
  );

  return data;
};

export const useGetAccounts = ({
  rootAccountName,
  startDate,
  endDate,
}: {
  rootAccountName?: string;
  startDate: Date;
  endDate: Date;
}) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.GET_ACCOUNTS,
      {
        startDate,
        endDate,
        rootAccountName,
      },
    ],
    queryFn: getAccounts,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
