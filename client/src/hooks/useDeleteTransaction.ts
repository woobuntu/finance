import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { Transaction } from "@prisma/client";

const deleteTransaction = async (id: number) => {
  const { data: returnData } = await axiosInstance.delete<Transaction>(
    `/transactions/${id}`
  );

  return returnData;
};

export const useDeleteTransaction = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess,
    onError,
  });
};
