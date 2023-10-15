import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { Transaction } from "@prisma/client";
import { gt, gte } from "lodash-es";

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
          <Table
            sx={{
              minWidth: 450,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 3}%`,
                  }}
                >
                  날짜
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 3}%`,
                  }}
                >
                  차변
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 3}%`,
                  }}
                >
                  대변
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell align="center">
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {transaction.debitAccountName === accountName
                      ? transaction.amount.toLocaleString()
                      : null}
                  </TableCell>
                  <TableCell align="center">
                    {transaction.creditAccountName === accountName
                      ? transaction.amount.toLocaleString()
                      : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableRow>
              <TableCell align="center">잔액</TableCell>
              <TableCell
                align="center"
                sx={{
                  color: accountSide === "CREDIT" ? "red" : "primary",
                }}
              >
                {accountSide === "DEBIT"
                  ? gte(sumOfDebit, sumOfCredit)
                    ? (sumOfDebit - sumOfCredit).toLocaleString()
                    : null
                  : gt(sumOfDebit, sumOfCredit)
                  ? (sumOfDebit - sumOfCredit).toLocaleString()
                  : null}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  color: accountSide === "DEBIT" ? "red" : "primary",
                }}
              >
                {accountSide === "CREDIT"
                  ? gte(sumOfCredit, sumOfDebit)
                    ? (sumOfCredit - sumOfDebit).toLocaleString()
                    : null
                  : gt(sumOfCredit, sumOfDebit)
                  ? (sumOfCredit - sumOfDebit).toLocaleString()
                  : null}
              </TableCell>
            </TableRow>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
