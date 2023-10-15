import { List, ListSubheader, Stack } from "@mui/material";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { Account, AccountProps } from "./Account";

export const IncomeStatement = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  const { data, isLoading } = useGetAccounts({
    startDate,
    endDate,
  });

  if (isLoading) {
    return <div>loading...</div>;
  }

  if (!data) {
    return <div>error</div>;
  }

  const debitAccounts = data
    .filter((account) => account.name === "비용")
    .map((account) => ({ ...account, depth: 0 })) as AccountProps[];

  const creditAccounts = data
    .filter((account) => account.name === "수익")
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
        subheader={<ListSubheader component="div">차변</ListSubheader>}
      >
        {debitAccounts.map((account) => (
          <Account key={account.name} {...account} depth={0} />
        ))}
      </List>
      <List
        sx={{ width: "100%", bgcolor: "background.paper" }}
        component="nav"
        subheader={<ListSubheader component="div">대변</ListSubheader>}
      >
        {creditAccounts.map((account) => (
          <Account key={account.name} {...account} depth={0} />
        ))}
      </List>
    </Stack>
  );
};
