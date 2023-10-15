import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { Prisma, Transaction } from "@prisma/client";

const createTransaction = async (data: Prisma.TransactionCreateInput) => {
  const { data: returnData } = await axiosInstance.post<Transaction>(
    "/transactions",
    data
  );

  return returnData;
};

export const useCreateTransaction = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: createTransaction,
    onSuccess,
    onError,
  });
};
