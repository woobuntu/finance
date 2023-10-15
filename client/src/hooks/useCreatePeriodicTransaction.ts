import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { PeriodicTransaction, Prisma } from "@prisma/client";

const createPeriodicTransaction = async (
  data: Prisma.PeriodicTransactionCreateInput
) => {
  const { data: returnData } = await axiosInstance.post<PeriodicTransaction>(
    "/transactions/periodic",
    data
  );

  return returnData;
};

export const useCreatePeriodicTransaction = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: createPeriodicTransaction,
    onSuccess,
    onError,
  });
};
