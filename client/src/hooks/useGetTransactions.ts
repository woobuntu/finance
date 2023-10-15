import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { axiosInstance } from "../axios";
import { ExtendedTransaction } from "@prisma-custom-types";
import { isNull } from "lodash-es";

const getTransactions = async ({
  queryKey,
}: QueryFunctionContext<
  [
    string,
    {
      startDate: Date | null;
      endDate: Date | null;
      accountName: string | null;
    }
  ]
>) => {
  const [_key, { startDate, endDate, accountName }] = queryKey;

  const { data } = await axiosInstance.get<ExtendedTransaction[]>(
    isNull(accountName)
      ? `/transactions?startDate=${startDate}&endDate=${endDate}`
      : `/transactions?startDate=${startDate}&endDate=${endDate}&accountName=${accountName}`
  );

  return data;
};

export const useGetTransactions = ({
  startDate,
  endDate,
  accountName,
}: {
  startDate: Date | null;
  endDate: Date | null;
  accountName: string | null;
}) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.GET_TRANSACTIONS,
      {
        startDate,
        endDate,
        accountName,
      },
    ],
    queryFn: getTransactions,
    enabled: !isNull(startDate) && !isNull(endDate),
    staleTime: 1000 * 60 * 60,
  });
};
