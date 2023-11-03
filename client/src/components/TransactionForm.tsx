import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { TRANSACTION_TYPES, TransactionType } from "../constants";
import { ChangeEventHandler, useEffect, useState } from "react";
import { AccountOption } from "../hooks/useGetAccountOptions";
import { AccountSelect } from "./AccountSelect";
import {
  TransactionFormAction,
  TransactionFormState,
  useTransactionFormReducer,
} from "../hooks/useTransactionFormReducer";
import { CurrencyInput } from "./CurrencyInput";
import { isNull, toNumber } from "lodash-es";
import { useCreateTransaction } from "../hooks/useCreateTransaction";
import { useQueryClient } from "@tanstack/react-query";
import { TagSelect } from "./TagSelect";

const TransferForm = ({
  transactionFormState,
  transactionFormDispatch,
}: {
  transactionFormState: TransactionFormState;
  transactionFormDispatch: React.Dispatch<TransactionFormAction>;
}) => {
  useEffect(() => {
    transactionFormDispatch({
      type: "RESET",
    });
  }, []);

  const onChangeDebitOption = (event: any, newValue: AccountOption | null) => {
    transactionFormDispatch({
      type: "SELECT_DEBIT",
      selectedOption: newValue,
    });
  };

  const onChangeAmount: ChangeEventHandler<HTMLInputElement> = (event) => {
    transactionFormDispatch({
      type: "CHANGE_AMOUNT",
      amount: event.target.value,
    });
  };

  const onChangeCreditOption = (event: any, newValue: AccountOption | null) => {
    transactionFormDispatch({
      type: "SELECT_CREDIT",
      selectedOption: newValue,
    });
  };

  const onChangeNote: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    transactionFormDispatch({
      type: "CHANGE_NOTE",
      note: value,
    });
  };

  const debitOptions = transactionFormState.debitOptions.filter(
    (option) => option.side === "DEBIT"
  );

  const creditOptions = transactionFormState.creditOptions.filter(
    (option) => option.parentAccountName === "계좌잔액"
  );

  return (
    <Stack direction="column" spacing={2}>
      <AccountSelect
        label="차변"
        value={transactionFormState.selectedDebitOption}
        options={debitOptions}
        onChange={onChangeDebitOption}
        error={transactionFormState.isDebitEmpty}
        helperText={
          transactionFormState.isDebitEmpty ? "차변 계정을 선택해주세요" : ""
        }
      />
      <CurrencyInput
        label="거래액"
        value={transactionFormState.amount}
        onChange={onChangeAmount}
        isErrored={transactionFormState.isAmountEmpty}
        helperText={
          transactionFormState.isAmountEmpty ? "거래액을 입력해주세요" : ""
        }
      />
      <AccountSelect
        label="대변"
        value={transactionFormState.selectedCreditOption}
        options={creditOptions}
        onChange={onChangeCreditOption}
        error={transactionFormState.isCreditEmpty}
        helperText={
          transactionFormState.isCreditEmpty ? "대변 계정을 선택해주세요" : ""
        }
      />
      <TextField
        label="메모"
        multiline
        required
        error={transactionFormState.isNoteEmpty}
        helperText={
          transactionFormState.isNoteEmpty ? "메모를 입력해주세요" : ""
        }
        value={transactionFormState.note}
        onChange={onChangeNote}
      />
      <TagSelect
        transactionFormState={transactionFormState}
        transactionFormDispatch={transactionFormDispatch}
      />
    </Stack>
  );
};

const LumpSumPaymentForm = ({
  transactionFormState,
  transactionFormDispatch,
}: {
  transactionFormState: TransactionFormState;
  transactionFormDispatch: React.Dispatch<TransactionFormAction>;
}) => {
  useEffect(() => {
    transactionFormDispatch({
      type: "RESET",
    });
  }, []);

  const onChangeDebitOption = (event: any, newValue: AccountOption | null) => {
    transactionFormDispatch({
      type: "SELECT_DEBIT",
      selectedOption: newValue,
    });
  };

  const onChangeAmount: ChangeEventHandler<HTMLInputElement> = (event) => {
    transactionFormDispatch({
      type: "CHANGE_AMOUNT",
      amount: event.target.value,
    });
  };

  const onChangeCreditOption = (event: any, newValue: AccountOption | null) => {
    transactionFormDispatch({
      type: "SELECT_CREDIT",
      selectedOption: newValue,
    });
  };

  const onChangeNote: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    transactionFormDispatch({
      type: "CHANGE_NOTE",
      note: value,
    });
  };

  const debitOptions = transactionFormState.debitOptions.filter(
    (option) => option.rootParentAccountName === "비용"
  );

  const creditOptions = transactionFormState.creditOptions.filter(
    (option) => option.parentAccountName === "카드부채"
  );

  return (
    <Stack direction="column" spacing={2}>
      {/* 차변은 비용 */}
      <AccountSelect
        label="차변"
        value={transactionFormState.selectedDebitOption}
        options={debitOptions}
        onChange={onChangeDebitOption}
        error={transactionFormState.isDebitEmpty}
        helperText={
          transactionFormState.isDebitEmpty ? "차변 계정을 선택해주세요" : ""
        }
      />
      {/* 거래액 */}
      <CurrencyInput
        label="거래액"
        value={transactionFormState.amount}
        onChange={onChangeAmount}
        isErrored={transactionFormState.isAmountEmpty}
        helperText={
          transactionFormState.isAmountEmpty ? "거래액을 입력해주세요" : ""
        }
      />
      {/* 대변은 카드부채 하위 */}
      <AccountSelect
        label="대변"
        value={transactionFormState.selectedCreditOption}
        options={creditOptions}
        onChange={onChangeCreditOption}
        error={transactionFormState.isCreditEmpty}
        helperText={
          transactionFormState.isCreditEmpty ? "대변 계정을 선택해주세요" : ""
        }
      />
      {/* 적요 */}
      <TextField
        label="메모"
        multiline
        required
        error={transactionFormState.isNoteEmpty}
        helperText={
          transactionFormState.isNoteEmpty ? "메모를 입력해주세요" : ""
        }
        value={transactionFormState.note}
        onChange={onChangeNote}
      />
      <TagSelect
        transactionFormState={transactionFormState}
        transactionFormDispatch={transactionFormDispatch}
      />
    </Stack>
  );
};

const InstallmentPaymentForm = ({
  transactionFormState,
  transactionFormDispatch,
}: {
  transactionFormState: TransactionFormState;
  transactionFormDispatch: React.Dispatch<TransactionFormAction>;
}) => {
  useEffect(() => {
    transactionFormDispatch({
      type: "RESET",
    });
  }, []);

  const debitOptions = transactionFormState.debitOptions.filter(
    (option) => option.rootParentAccountName === "비용"
  );

  const creditOptions = transactionFormState.creditOptions.filter(
    (option) => option.parentAccountName === "카드부채"
  );

  const onChangeDebitOption = (event: any, newValue: AccountOption | null) => {
    transactionFormDispatch({
      type: "SELECT_DEBIT",
      selectedOption: newValue,
    });
  };

  const onChangeAmount: ChangeEventHandler<HTMLInputElement> = (event) => {
    transactionFormDispatch({
      type: "CHANGE_AMOUNT",
      amount: event.target.value,
    });
  };

  const onChangeCreditOption = (event: any, newValue: AccountOption | null) => {
    transactionFormDispatch({
      type: "SELECT_CREDIT",
      selectedOption: newValue,
    });
  };

  const onChangeNote: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    transactionFormDispatch({
      type: "CHANGE_NOTE",
      note: value,
    });
  };

  const onChangeInstallmentPeriod = (event: SelectChangeEvent) => {
    transactionFormDispatch({
      type: "CHANGE_INSTALLMENT_PERIOD",
      installmentPeriod: event.target.value,
    });
  };

  return (
    <Stack direction="column" spacing={2}>
      {/* 차변은 비용 */}
      <AccountSelect
        label="차변"
        value={transactionFormState.selectedDebitOption}
        options={debitOptions}
        onChange={onChangeDebitOption}
        error={transactionFormState.isDebitEmpty}
        helperText={
          transactionFormState.isDebitEmpty ? "차변 계정을 선택해주세요" : ""
        }
      />
      {/* 거래액 */}
      <CurrencyInput
        label="거래액"
        value={transactionFormState.amount}
        onChange={onChangeAmount}
        isErrored={transactionFormState.isAmountEmpty}
        helperText={
          transactionFormState.isAmountEmpty ? "거래액을 입력해주세요" : ""
        }
      />
      {/* 대변은 카드부채 하위 */}
      <AccountSelect
        label="대변"
        value={transactionFormState.selectedCreditOption}
        options={creditOptions}
        onChange={onChangeCreditOption}
        error={transactionFormState.isCreditEmpty}
        helperText={
          transactionFormState.isCreditEmpty ? "대변 계정을 선택해주세요" : ""
        }
      />
      {/* 할부 개월 수 */}
      <FormControl error={transactionFormState.isInstallmentPeriodEmpty}>
        <InputLabel>할부 개월 수</InputLabel>
        <Select
          value={transactionFormState.installmentPeriod}
          onChange={onChangeInstallmentPeriod}
        >
          {Array.from({ length: 11 }, (_, i) => i + 2).map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
        {transactionFormState.isInstallmentPeriodEmpty && (
          <FormHelperText>할부 개월 수를 선택해주세요</FormHelperText>
        )}
      </FormControl>
      {/* 적요 */}
      <TextField
        label="메모"
        multiline
        required
        error={transactionFormState.isNoteEmpty}
        helperText={
          transactionFormState.isNoteEmpty ? "메모를 입력해주세요" : ""
        }
        value={transactionFormState.note}
        onChange={onChangeNote}
      />
      <TagSelect
        transactionFormState={transactionFormState}
        transactionFormDispatch={transactionFormDispatch}
      />
    </Stack>
  );
};

const OtherTransactionForm = ({
  transactionFormState,
  transactionFormDispatch,
}: {
  transactionFormState: TransactionFormState;
  transactionFormDispatch: React.Dispatch<TransactionFormAction>;
}) => {
  useEffect(() => {
    transactionFormDispatch({
      type: "RESET",
    });
  }, []);

  const onChangeDebitOption = (event: any, newValue: AccountOption | null) => {
    transactionFormDispatch({
      type: "SELECT_DEBIT",
      selectedOption: newValue,
    });
  };

  const onChangeAmount: ChangeEventHandler<HTMLInputElement> = (event) => {
    transactionFormDispatch({
      type: "CHANGE_AMOUNT",
      amount: event.target.value,
    });
  };

  const onChangeCreditOption = (event: any, newValue: AccountOption | null) => {
    transactionFormDispatch({
      type: "SELECT_CREDIT",
      selectedOption: newValue,
    });
  };

  const onChangeNote: ChangeEventHandler<HTMLInputElement> = ({
    target: { value },
  }) => {
    transactionFormDispatch({
      type: "CHANGE_NOTE",
      note: value,
    });
  };

  return (
    <Stack direction="column" spacing={2}>
      {/* 차변 */}
      <AccountSelect
        label="차변"
        value={transactionFormState.selectedDebitOption}
        options={transactionFormState.debitOptions}
        onChange={onChangeDebitOption}
        error={transactionFormState.isDebitEmpty}
        helperText={
          transactionFormState.isDebitEmpty ? "차변 계정을 선택해주세요" : ""
        }
      />
      {/* 거래액 */}
      <CurrencyInput
        label="거래액"
        value={transactionFormState.amount}
        onChange={onChangeAmount}
        isErrored={transactionFormState.isAmountEmpty}
        helperText={
          transactionFormState.isAmountEmpty ? "거래액을 입력해주세요" : ""
        }
      />
      {/* 대변 */}
      <AccountSelect
        label="대변"
        value={transactionFormState.selectedCreditOption}
        options={transactionFormState.creditOptions}
        onChange={onChangeCreditOption}
        error={transactionFormState.isCreditEmpty}
        helperText={
          transactionFormState.isCreditEmpty ? "대변 계정을 선택해주세요" : ""
        }
      />
      {/* 적요 */}
      <TextField
        label="메모"
        multiline
        required
        error={transactionFormState.isNoteEmpty}
        helperText={
          transactionFormState.isNoteEmpty ? "메모를 입력해주세요" : ""
        }
        value={transactionFormState.note}
        onChange={onChangeNote}
      />
      <TagSelect
        transactionFormState={transactionFormState}
        transactionFormDispatch={transactionFormDispatch}
      />
    </Stack>
  );
};

const ConditionalForm = ({
  transactionType,
  transactionFormState,
  transactionFormDispatch,
}: {
  transactionType: TransactionType;
  transactionFormState: TransactionFormState;
  transactionFormDispatch: React.Dispatch<TransactionFormAction>;
}) => {
  switch (transactionType) {
    case "이체 거래":
      return (
        <TransferForm
          transactionFormState={transactionFormState}
          transactionFormDispatch={transactionFormDispatch}
        />
      );
    case "카드 일시불 거래":
      return (
        <LumpSumPaymentForm
          transactionFormState={transactionFormState}
          transactionFormDispatch={transactionFormDispatch}
        />
      );
    case "카드 할부 거래":
      return (
        <InstallmentPaymentForm
          transactionFormState={transactionFormState}
          transactionFormDispatch={transactionFormDispatch}
        />
      );
    case "그외 기타 분개":
      return (
        <OtherTransactionForm
          transactionFormState={transactionFormState}
          transactionFormDispatch={transactionFormDispatch}
        />
      );
  }
};

export const TransactionForm = ({ selectedDate }: { selectedDate: Date }) => {
  const [transactionType, setTransactionType] =
    useState<TransactionType>("카드 일시불 거래");

  const {
    transactionFormState,
    transactionFormIsLoading,
    transactionFormDispatch,
  } = useTransactionFormReducer();

  useEffect(() => {
    transactionFormDispatch({
      type: "RESET",
    });
    setTransactionType("카드 일시불 거래");
  }, []);

  const queryClient = useQueryClient();

  const mutation = useCreateTransaction({
    onSuccess: () => {
      transactionFormDispatch({
        type: "RESET",
      });
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      alert(error);
    },
  });

  const onChangeTransactionType = (
    event: SelectChangeEvent<TransactionType>
  ) => {
    setTransactionType(event.target.value as TransactionType);
  };

  if (transactionFormIsLoading) {
    return <div>loading...</div>;
  }

  const onClickSubmit = () => {
    if (
      isNull(transactionFormState.selectedDebitOption) ||
      isNull(transactionFormState.selectedCreditOption) ||
      transactionFormState.amount === "" ||
      transactionFormState.note === "" ||
      (transactionType === "카드 할부 거래" &&
        !transactionFormState.installmentPeriod)
    ) {
      if (isNull(transactionFormState.selectedDebitOption)) {
        transactionFormDispatch({
          type: "SET_DEBIT_EMPTY",
          isDebitEmpty: true,
        });
      }

      if (isNull(transactionFormState.selectedCreditOption)) {
        transactionFormDispatch({
          type: "SET_CREDIT_EMPTY",
          isCreditEmpty: true,
        });
      }

      if (transactionFormState.amount === "") {
        transactionFormDispatch({
          type: "SET_AMOUNT_EMPTY",
          isAmountEmpty: true,
        });
      }

      if (transactionFormState.note === "") {
        transactionFormDispatch({
          type: "SET_NOTE_EMPTY",
          isNoteEmpty: true,
        });
      }

      if (
        transactionType === "카드 할부 거래" &&
        !transactionFormState.installmentPeriod
      ) {
        transactionFormDispatch({
          type: "SET_INSTALLMENT_PERIOD_EMPTY",
          isInstallmentPeriodEmpty: true,
        });
      }

      return;
    }

    const tagParams =
      transactionFormState.tags.length == 0
        ? {}
        : {
            transactionTags: {
              create: transactionFormState.tags.map((tag) => ({
                tag: {
                  connectOrCreate: {
                    where: {
                      name: tag.name,
                    },
                    create: {
                      name: tag.name,
                    },
                  },
                },
              })),
            },
          };

    mutation.mutate({
      debit: {
        connect: {
          name: transactionFormState.selectedDebitOption.name,
        },
      },
      amount: toNumber(transactionFormState.amount),
      credit: {
        connect: {
          name: transactionFormState.selectedCreditOption.name,
        },
      },
      date: selectedDate,
      note: transactionFormState.note,
      installmentPeriod: transactionFormState.installmentPeriod,

      ...tagParams,
    });
  };

  return (
    <Stack direction="column" spacing={2} paddingBottom={3}>
      <FormControl fullWidth>
        <InputLabel>거래유형</InputLabel>
        <Select
          label="거래유형"
          value={transactionType}
          onChange={onChangeTransactionType}
        >
          {TRANSACTION_TYPES.map((transactionType) => (
            <MenuItem key={transactionType} value={transactionType}>
              {transactionType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <ConditionalForm
        transactionType={transactionType}
        transactionFormState={transactionFormState}
        transactionFormDispatch={transactionFormDispatch}
      />
      <Button variant="outlined" size="large" onClick={onClickSubmit}>
        기록하기
      </Button>
    </Stack>
  );
};
