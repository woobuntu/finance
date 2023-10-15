import { List, ListSubheader, Stack } from "@mui/material";
import { Account, AccountProps } from "./Account";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { startOfYear } from "date-fns";

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

  return (
    <Stack
      direction={{
        xs: "column",
        md: "row",
      }}
      spacing={2}
    >
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
    </Stack>
  );
};
