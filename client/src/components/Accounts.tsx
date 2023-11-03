import { List, ListSubheader, Stack, Typography } from "@mui/material";
import { Account, AccountProps } from "./Account";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { startOfYear } from "date-fns";
import { add } from "lodash-es";
import { getBalance } from "../utils/getBalance";

export const Accounts = ({ endDate }: { endDate: Date }) => {
  const { data, isLoading } = useGetAccounts({
    startDate: startOfYear(new Date()),
    endDate,
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>error</div>;
  }

  const debitAccounts = data
    .filter((account) => account.side === "DEBIT")
    .map((account) => ({ ...account, depth: 0 })) as AccountProps[];

  const creditAccounts = data
    .filter((account) => account.side === "CREDIT")
    .map((account) => ({ ...account, depth: 0 })) as AccountProps[];

  const sumOfDebitAccounts = debitAccounts
    .reduce((acc, account) => add(acc, getBalance(account)), 0)
    .toLocaleString();

  const sumOfCreditAccounts = creditAccounts
    .reduce((acc, account) => add(acc, getBalance(account)), 0)
    .toLocaleString();

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="column">
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
          subheader={
            <ListSubheader component="div">계정과목(차변)</ListSubheader>
          }
        >
          {debitAccounts.map((account) => (
            <Account key={account.name} {...account} depth={0} mode="EDIT" />
          ))}
        </List>

        <Stack direction="row" justifyContent="space-between" paddingX={7}>
          <Typography>차변 합계</Typography>
          <Typography>{sumOfDebitAccounts} 원</Typography>
        </Stack>
      </Stack>

      <Stack direction="column">
        <List
          sx={{ width: "100%", bgcolor: "background.paper" }}
          component="nav"
          subheader={
            <ListSubheader component="div">계정과목(대변)</ListSubheader>
          }
        >
          {creditAccounts.map((account) => (
            <Account key={account.name} {...account} depth={0} mode="EDIT" />
          ))}
        </List>

        <Stack direction="row" justifyContent="space-between" paddingX={7}>
          <Typography>대변 합계</Typography>
          <Typography>{sumOfCreditAccounts} 원</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
