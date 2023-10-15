import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Stack,
} from "@mui/material";
import { AccountSelect } from "./AccountSelect";
import { useJournalReducer } from "../hooks/useJournalReducer";
import { AccountOption } from "../hooks/useGetAccountOptions";
import { CurrencyInput } from "./CurrencyInput";
import { ChangeEventHandler, useState } from "react";
import { INTERVAL_OPTIONS, IntervalOption, QUERY_KEYS } from "../constants";
import { DatePicker } from "@mui/x-date-pickers";
import { useCreatePeriodicTransaction } from "../hooks/useCreatePeriodicTransaction";
import { isNestException } from "../utils/isNestException";
import { isNull, toNumber } from "lodash-es";
import { isAfter } from "date-fns";
import React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { Interval } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useDateRangeReducer } from "../hooks/useDateRangeReducer";

function convertInterval(option: IntervalOption): Interval {
  switch (option) {
    case "매년":
      return "YEARLY";
    case "매월":
      return "MONTHLY";
    case "매주":
      return "WEEKLY";
    case "매일":
      return "DAILY";
  }
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const PeriodicTransactionForm = () => {
  const { journalState, journalDispatch } = useJournalReducer();

  const [dateRangeState, dateRangeDispatch] = useDateRangeReducer();

  const onChangeStartDate = (date: Date | null) => {
    if (isNull(date)) {
      return;
    }
    dateRangeDispatch({
      type: "SET_START_DATE",
      startDate: date,
    });
  };

  const onChangeEndDate = (date: Date | null) => {
    if (isNull(date)) {
      return;
    }
    dateRangeDispatch({
      type: "SET_END_DATE",
      endDate: date,
    });
  };

  const onChangeDebit = (event: any, newValue: AccountOption | null) => {
    journalDispatch({
      type: "SELECT_DEBIT",
      selectedOption: newValue,
    });
  };

  const onChangeCredit = (event: any, newValue: AccountOption | null) => {
    journalDispatch({
      type: "SELECT_CREDIT",
      selectedOption: newValue,
    });
  };

  const onChangeAmount: ChangeEventHandler<HTMLInputElement> = (event) => {
    journalDispatch({
      type: "CHANGE_AMOUNT",
      amount: event.target.value,
    });
  };

  const [interval, setInterval] = useState<IntervalOption>("매월");

  const onSelectInterval = (event: SelectChangeEvent<IntervalOption>) => {
    setInterval(event.target.value as IntervalOption);
  };

  const queryClient = useQueryClient();

  const mutation = useCreatePeriodicTransaction({
    onSuccess: () => {
      journalDispatch({
        type: "RESET",
      });

      dateRangeDispatch({
        type: "RESET",
      });

      setInterval("매월");

      queryClient.invalidateQueries(QUERY_KEYS.GET_ACCOUNTS);
      queryClient.invalidateQueries(QUERY_KEYS.GET_ACCOUNT_OPTIONS);
      queryClient.invalidateQueries(QUERY_KEYS.GET_PERIODIC_TRANSACTIONS);
      queryClient.invalidateQueries(QUERY_KEYS.GET_TRANSACTIONS);
    },
    onError: (error) => {
      if (isNestException(error)) {
      } else {
      }
    },
  });

  const onSave = () => {
    if (
      isNull(journalState.selectedDebitOption) ||
      isNull(journalState.selectedCreditOption) ||
      journalState.amount === "" ||
      isNull(dateRangeState.startDate) ||
      isNull(dateRangeState.endDate)
    ) {
      if (isNull(journalState.selectedDebitOption)) {
        journalDispatch({
          type: "SET_DEBIT_EMPTY",
          isDebitEmpty: true,
        });
      }
      if (isNull(journalState.selectedCreditOption)) {
        journalDispatch({
          type: "SET_CREDIT_EMPTY",
          isCreditEmpty: true,
        });
      }
      if (journalState.amount === "") {
        journalDispatch({
          type: "SET_AMOUNT_EMPTY",
          isAmountEmpty: true,
        });
      }
      if (isNull(dateRangeState.startDate) || isNull(dateRangeState.endDate)) {
        dateRangeDispatch({
          type: "SET_ARE_DATES_INCOMPLETE",
          areDatesIncomplete: true,
        });
      }
      return;
    }
    mutation.mutate({
      amount: toNumber(journalState.amount),
      debit: {
        connect: {
          name: journalState.selectedDebitOption.name,
        },
      },
      credit: {
        connect: {
          name: journalState.selectedCreditOption.name,
        },
      },
      startDate: dateRangeState.startDate.toString(),
      endDate: dateRangeState.endDate.toString(),
      interval: convertInterval(interval),
    });
  };

  return (
    <Stack spacing={2}>
      <AccountSelect
        label="차변계정"
        value={journalState.selectedDebitOption}
        options={journalState.debitOptions}
        onChange={onChangeDebit}
        error={journalState.isDebitEmpty}
        helperText={journalState.isDebitEmpty ? "차변 계정을 선택해주세요" : ""}
      />
      <CurrencyInput
        label="거래액"
        value={journalState.amount}
        onChange={onChangeAmount}
        isErrored={journalState.isAmountEmpty}
        helperText={journalState.isAmountEmpty ? "거래액을 입력해주세요" : ""}
      />
      <AccountSelect
        label="대변계정"
        value={journalState.selectedCreditOption}
        options={journalState.creditOptions}
        onChange={onChangeCredit}
        error={journalState.isCreditEmpty}
        helperText={
          journalState.isCreditEmpty ? "대변 계정을 선택해주세요" : ""
        }
      />
      <FormControl fullWidth>
        <InputLabel id="interval-label">주기</InputLabel>
        <Select value={interval} label="주기" onChange={onSelectInterval}>
          {INTERVAL_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <DatePicker
        label="시작일"
        value={dateRangeState.startDate}
        onChange={onChangeStartDate}
      />

      <DatePicker
        label="종료일"
        value={dateRangeState.endDate}
        onChange={onChangeEndDate}
      />

      <Button variant="contained" onClick={onSave}>
        등록
      </Button>
      <Snackbar
        open={dateRangeState.areDatesIncomplete}
        autoHideDuration={6000}
        onClose={() => {
          dateRangeDispatch({
            type: "SET_ARE_DATES_INCOMPLETE",
            areDatesIncomplete: false,
          });
        }}
      >
        <Alert severity="error">시작일이나 종료일이 지정되지 않았습니다.</Alert>
      </Snackbar>
    </Stack>
  );
};
