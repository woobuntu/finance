import {
  Collapse,
  IconButton,
  List,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import { useGetAccounts } from "../hooks/useGetAccounts";
import { Account, AccountProps } from "./Account";
import { getBalance } from "../utils/getBalance";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

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

  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const sumOfDebitAccounts = getBalance(debitAccounts[0]).toLocaleString();

  const sumOfCreditAccounts = getBalance(creditAccounts[0]).toLocaleString();

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" paddingX={2} alignItems="center" spacing={1}>
        <IconButton onClick={toggleIsOpen}>
          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>

        <Typography variant="h6">손익계산서</Typography>
      </Stack>

      <Collapse in={isOpen}>
        <Stack
          direction="column"
          sx={{
            width: "100%",
          }}
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

          <Stack direction="row" justifyContent="space-between" paddingX={7}>
            <Typography>비용 합계</Typography>
            <Typography>{sumOfDebitAccounts} 원</Typography>
          </Stack>
        </Stack>

        <Stack
          direction="column"
          sx={{
            width: "100%",
          }}
        >
          <List
            sx={{ width: "100%", bgcolor: "background.paper" }}
            component="nav"
            subheader={<ListSubheader component="div">대변</ListSubheader>}
          >
            {creditAccounts.map((account) => (
              <Account key={account.name} {...account} depth={0} />
            ))}
          </List>

          <Stack direction="row" justifyContent="space-between" paddingX={7}>
            <Typography>수익 합계</Typography>
            <Typography>{sumOfCreditAccounts} 원</Typography>
          </Stack>
        </Stack>
      </Collapse>
    </Stack>
  );
};
