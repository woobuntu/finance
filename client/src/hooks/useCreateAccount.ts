import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { Account } from "@prisma/client";
import { CreateAccountDTO } from "@prisma-custom-types";

const createAccount = async (data: CreateAccountDTO) => {
  const { data: createdAccount } = await axiosInstance.post<Account>(
    "/accounts",
    data
  );

  return createdAccount;
};

export const useCreateAccount = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: createAccount,
    onSuccess,
    onError,
  });
};
