import { TableCell, TableRow } from "@mui/material";
import { CurrencyInput } from "./CurrencyInput";
import { ChangeEventHandler } from "react";
import { AccountSelect } from "./AccountSelect";
import { JournalAction, JournalState } from "../hooks/useJournalReducer";
import { AccountOption } from "../hooks/useGetAccountOptions";

export const AddJournalRow = ({
  journalState,
  journalDispatch,
}: {
  journalState: JournalState;
  journalDispatch: React.Dispatch<JournalAction>;
}) => {
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

  return (
    <TableRow>
      <TableCell align="center">
        <AccountSelect
          label="차변계정"
          value={journalState.selectedDebitOption}
          options={journalState.debitOptions}
          onChange={onChangeDebit}
          error={journalState.isDebitEmpty}
          helperText={
            journalState.isDebitEmpty ? "차변 계정을 선택해주세요" : ""
          }
        />
      </TableCell>
      <TableCell align="center">
        <CurrencyInput
          label="거래액"
          value={journalState.amount}
          onChange={onChangeAmount}
          isErrored={journalState.isAmountEmpty}
          helperText={journalState.isAmountEmpty ? "거래액을 입력해주세요" : ""}
        />
      </TableCell>
      <TableCell align="center">
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
      </TableCell>
    </TableRow>
  );
};
