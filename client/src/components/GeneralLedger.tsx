import { Stack } from "@mui/material";
import { AccountSelect } from "./AccountSelect";
import { useJournalReducer } from "../hooks/useJournalReducer";
import { AccountOption } from "../hooks/useGetAccountOptions";
import { isNull, isUndefined } from "lodash-es";
import { useGetTransactions } from "../hooks/useGetTransactions";
import { LedgerTable } from "./LedgerTable";

export const GeneralLedger = ({
  startDate,
  endDate,
}: {
  startDate: Date | null;
  endDate: Date | null;
}) => {
  const { isLoading, journalState, journalDispatch } = useJournalReducer();

  const onChange = (event: any, newValue: AccountOption | null) => {
    journalDispatch({
      type: "SELECT_DEBIT",
      selectedOption: newValue,
    });
  };

  const { data } = useGetTransactions({
    startDate,
    endDate,
    accountName: journalState.selectedDebitOption?.name ?? null,
  });

  return (
    <Stack spacing={2} paddingBottom={3}>
      <AccountSelect
        label="계정과목"
        value={journalState.selectedDebitOption}
        options={journalState.debitOptions}
        onChange={onChange}
        error={journalState.isDebitEmpty}
        helperText=""
      />
      {!isNull(journalState.selectedDebitOption) && !isUndefined(data) && (
        <LedgerTable
          accountName={journalState.selectedDebitOption.name}
          accountSide={journalState.selectedDebitOption.side}
          transactions={data}
        />
      )}
    </Stack>
  );
};
