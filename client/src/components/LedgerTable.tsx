import {
  Box,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Transaction } from "@prisma/client";
import { gt, gte, multiply } from "lodash-es";
import React, { useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const LedgerTableRow = ({
  transaction,
  accountName,
}: {
  transaction: Transaction;
  accountName: string;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      <TableRow key={transaction.id}>
        <TableCell>
          <IconButton size="small" onClick={toggleIsOpen}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">
          {new Date(transaction.date).toLocaleDateString()}
        </TableCell>
        <TableCell align="center">
          {transaction.debitAccountName === accountName
            ? transaction.amount.toLocaleString()
            : multiply(transaction.amount, -1).toLocaleString()}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={3}
          style={{
            paddingBottom: 0,
            paddingTop: 0,
          }}
        >
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <Stack direction="column" spacing={2} paddingY={2}>
              <TextField
                label="거래일"
                disabled
                value={new Date(transaction.date).toLocaleDateString()}
              />

              <TextField
                label="차변"
                disabled
                value={transaction.debitAccountName}
              />

              <TextField
                label="거래액"
                disabled
                value={`${transaction.amount.toLocaleString()} 원`}
              />

              <TextField
                label="대변"
                disabled
                value={transaction.creditAccountName}
              />

              <TextField
                label="메모"
                multiline
                disabled
                value={transaction.note}
              />
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export const LedgerTable = ({
  accountName,
  accountSide,
  transactions,
}: {
  accountName: string;
  accountSide: "DEBIT" | "CREDIT";
  transactions: Transaction[];
}) => {
  const sumOfDebit = transactions
    .filter((transaction) => transaction.debitAccountName === accountName)
    .reduce((acc, cur) => acc + cur.amount, 0);

  const sumOfCredit = transactions
    .filter((transaction) => transaction.creditAccountName === accountName)
    .reduce((acc, cur) => acc + cur.amount, 0);

  const balance =
    accountSide === "DEBIT"
      ? sumOfDebit - sumOfCredit
      : sumOfCredit - sumOfDebit;

  return (
    <Box>
      <Paper>
        <Toolbar>
          <Typography
            sx={{
              flex: "1 1 100%",
            }}
            variant="h6"
            component="div"
          >
            {accountName}
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell
                  align="center"
                  sx={{
                    width: `40%`,
                  }}
                >
                  날짜
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `40%`,
                  }}
                >
                  증감액
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <LedgerTableRow
                  key={transaction.id}
                  transaction={transaction}
                  accountName={accountName}
                />
              ))}
            </TableBody>
            <TableRow>
              <TableCell align="center">잔액</TableCell>
              <TableCell />
              <TableCell
                align="center"
                sx={{
                  color: gte(balance, 0) ? "primary" : "red",
                }}
              >
                {balance.toLocaleString()}
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
