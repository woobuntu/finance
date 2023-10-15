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
import { useGetPeriodicTransactions } from "../hooks/useGetPeriodicTransactions";
import { isUndefined } from "lodash-es";

export const EnrolledPeriodicTransactions = () => {
  const { data, isLoading } = useGetPeriodicTransactions();

  if (isLoading) return <div>loading...</div>;

  if (isUndefined(data)) return <div>data is undefined</div>;

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
            등록 정기 거래
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{
              minWidth: 750,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 6}%`,
                  }}
                >
                  차변
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 6}%`,
                  }}
                >
                  거래액
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 6}%`,
                  }}
                >
                  대변
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 6}%`,
                  }}
                >
                  주기
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 6}%`,
                  }}
                >
                  시작일
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 6}%`,
                  }}
                >
                  종료일
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((periodicTransaction) => (
                <TableRow key={periodicTransaction.id}>
                  <TableCell align="center">
                    {periodicTransaction.debitAccountName}
                  </TableCell>
                  <TableCell align="center">
                    {/* format amount to currency */}
                    {`${periodicTransaction.amount.toLocaleString()}원`}
                  </TableCell>
                  <TableCell align="center">
                    {periodicTransaction.creditAccountName}
                  </TableCell>
                  <TableCell align="center">
                    {periodicTransaction.interval}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(
                      periodicTransaction.startDate
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(periodicTransaction.endDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
