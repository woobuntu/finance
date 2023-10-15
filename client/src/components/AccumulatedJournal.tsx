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
import { ExtendedTransaction } from "@prisma-custom-types";

const CustomTableRow = ({
  transaction,
}: {
  transaction: ExtendedTransaction;
}) => {
  return (
    <TableRow>
      <TableCell align="center">
        {new Date(transaction.date).toLocaleDateString()}
      </TableCell>
      <TableCell align="center">{transaction.debitAccountName}</TableCell>
      <TableCell align="center">{transaction.amount}</TableCell>
      <TableCell align="center">{transaction.creditAccountName}</TableCell>
    </TableRow>
  );
};

export const AccumulatedJournal = ({
  accumulatedTransactions,
}: {
  accumulatedTransactions: ExtendedTransaction[];
}) => {
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
            누적분
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{
              minWidth: 650,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    width: "25%",
                  }}
                >
                  날짜
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: "25%",
                  }}
                >
                  차변
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: "25%",
                  }}
                >
                  거래액
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: "25%",
                  }}
                >
                  대변
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accumulatedTransactions.map((transaction) => (
                <CustomTableRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
