import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { axiosInstance } from "../axios";
import { RootAccounts } from "@prisma-custom-types";

const getAccounts = async ({
  queryKey,
}: QueryFunctionContext<[string, { startDate: Date; endDate: Date }]>) => {
  const [_key, { startDate, endDate }] = queryKey;

  const { data } = await axiosInstance.get<RootAccounts>(
    `/accounts?startDate=${startDate}&endDate=${endDate}`
  );

  return data;
};

export const useGetAccounts = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  return useQuery({
    queryKey: [
      ...QUERY_KEYS.GET_ACCOUNTS,
      {
        startDate,
        endDate,
      },
    ],
    queryFn: getAccounts,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
