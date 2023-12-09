import { AccountOption } from "../hooks/useGetAccountOptions";

export function haveParentAccount({
  currentAccount,
  parentAccountName,
  accountOptions,
}: {
  currentAccount: AccountOption;
  parentAccountName: string;
  accountOptions: AccountOption[];
}): boolean {
  if (currentAccount.parentAccountName === parentAccountName) return true;
  const parentAccount = accountOptions.find(
    (account) => account.name === currentAccount.parentAccountName
  );
  if (!parentAccount) return false;
  return haveParentAccount({
    currentAccount: parentAccount,
    parentAccountName,
    accountOptions,
  });
}
