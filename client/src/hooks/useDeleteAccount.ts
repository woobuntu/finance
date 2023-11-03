import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { Account } from "@prisma/client";

const deleteAccount = async ({ name }: { name: string }) => {
  const { data } = await axiosInstance.delete<Account>(`/accounts/${name}`);
  return data;
};

export const useDeleteAccount = ({
  onSuccess,
  onError,
}: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess,
    onError,
  });
};
