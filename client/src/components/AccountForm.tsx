import { Button, Skeleton, Stack } from "@mui/material";
import { AccountSelect } from "./AccountSelect";
import {
  AccountOption,
  useGetAccountOptions,
} from "../hooks/useGetAccountOptions";
import { isNull, isUndefined } from "lodash-es";
import { useState } from "react";
import { haveParentAccount } from "../utils/haveParentAccount";
import { useUpdateAccount } from "../hooks/useUpdateAccount";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";

function getParentAccount({
  account,
  accountOptions,
}: {
  account: AccountOption | null;
  accountOptions: AccountOption[];
}) {
  if (isNull(account)) return null;
  if (isUndefined(accountOptions)) return null;
  if (isNull(account.parentAccountName)) return null;

  return accountOptions.find(
    (option) => option.name === account.parentAccountName
  );
}

function getIsDisabled({
  selectedAccount,
  selectedParentAccount,
  accountOptions,
}: {
  selectedAccount: AccountOption | null;
  selectedParentAccount: AccountOption | null;
  accountOptions: AccountOption[];
}) {
  if (isNull(selectedAccount)) return true;
  if (isNull(selectedParentAccount)) return true;
  if (isNull(selectedAccount.parentAccountName)) return true;
  if (selectedAccount.name === selectedParentAccount.name) return true;
  const parentAccount = getParentAccount({
    account: selectedAccount,
    accountOptions,
  });
  if (isNull(parentAccount)) return true;
  if (isUndefined(parentAccount)) return true;
  if (parentAccount.name === selectedParentAccount.name) return true;
  if (
    haveParentAccount({
      currentAccount: selectedParentAccount,
      parentAccountName: selectedAccount.name,
      accountOptions,
    })
  )
    return true;
  return false;
}

export const AccountForm = () => {
  const { isLoading, data } = useGetAccountOptions();

  const [selectedAccount, setSelectedAccount] = useState<AccountOption | null>(
    null
  );

  const [selectedParentAccount, setSelectedParentAccount] =
    useState<AccountOption | null>(null);

  const queryClient = useQueryClient();

  const updateAccountMutation = useUpdateAccount({
    onSuccess: () => {
      setSelectedAccount(null);
      setSelectedParentAccount(null);
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_ACCOUNTS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_ACCOUNT_OPTIONS,
      });
    },
    onError: (error: any) => {
      alert(error);
    },
  });

  const onClickSave = () => {
    console.log("0");
    if (isNull(selectedAccount)) return;
    console.log("1");

    if (isNull(selectedParentAccount)) return;
    console.log("2");

    updateAccountMutation.mutate({
      name: selectedAccount.name,
      data: {
        parentAccount: {
          connect: {
            name: selectedParentAccount.name,
          },
        },
      },
    });
    console.log("3");
  };

  if (isLoading) {
    return <Skeleton variant="rectangular" height={118} />;
  }
  if (isUndefined(data)) {
    return <Skeleton variant="rectangular" height={118} />;
  }

  const onChangeAccount = (event: any, newValue: AccountOption | null) => {
    setSelectedAccount(newValue);

    const parentAccount = getParentAccount({
      account: newValue,
      accountOptions: data,
    });

    if (isUndefined(parentAccount)) return;

    setSelectedParentAccount(parentAccount);
  };

  const onChangeParentAccount = (
    event: any,
    newValue: AccountOption | null
  ) => {
    setSelectedParentAccount(newValue);
  };

  return (
    <Stack direction="column" spacing={2} mt={2}>
      <AccountSelect
        label="계정과목"
        value={selectedAccount}
        options={data}
        onChange={onChangeAccount}
        error={false}
        helperText=""
      />

      <AccountSelect
        label="부모 계정과목"
        value={selectedParentAccount}
        options={data}
        onChange={onChangeParentAccount}
        error={false}
        helperText=""
      />

      <Button
        variant="contained"
        color="primary"
        onClick={onClickSave}
        disabled={getIsDisabled({
          selectedAccount,
          selectedParentAccount,
          accountOptions: data,
        })}
      >
        부모 계정과목 변경
      </Button>
    </Stack>
  );
};
