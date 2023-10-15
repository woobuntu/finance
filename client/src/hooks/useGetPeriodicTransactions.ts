import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { PeriodicTransaction } from "@prisma/client";
import { QUERY_KEYS } from "../constants";

const getPeriodicTransactions = async () => {
  const { data } = await axiosInstance.get<PeriodicTransaction[]>(
    "/transactions/periodic"
  );

  return data;
};

export const useGetPeriodicTransactions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.GET_PERIODIC_TRANSACTIONS,
    queryFn: getPeriodicTransactions,
  });
};
