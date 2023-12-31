import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { Transaction } from "@prisma/client";
import { CreateTransactionDTO } from "@prisma-custom-types";

const createTransaction = async (data: CreateTransactionDTO) => {
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
