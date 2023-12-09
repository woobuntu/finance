import { Account, Prisma } from "@prisma/client";
import { axiosInstance } from "../axios";
import { useMutation } from "@tanstack/react-query";

const updateAccount = async ({
  data,
  name,
}: {
  data: Prisma.AccountUpdateInput;
  name: string;
}) => {
  console.log("뭔데");
  const { data: updatedAccount } = await axiosInstance.patch<Account>(
    `/accounts/${name}`,
    data
  );

  return updatedAccount;
};

export const useUpdateAccount = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: updateAccount,
    onSuccess,
    onError,
  });
};
