import { axiosInstance } from "../axios";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";

export type AccountOption = {
  name: string;
  side: "DEBIT" | "CREDIT";
  parentAccountName: string | null;
  rootParentAccountName: string;
};

const getAccountOptions = async () => {
  const { data } = await axiosInstance.get<AccountOption[]>(
    "/accounts/options"
  );

  return data;
};

export const useGetAccountOptions = () => {
  return useQuery({
    queryKey: QUERY_KEYS.GET_ACCOUNT_OPTIONS,
    queryFn: getAccountOptions,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
