import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { AddJournalRow } from "./AddJournalRow";
import SaveIcon from "@mui/icons-material/Save";
import { JournalAction, JournalState } from "../hooks/useJournalReducer";
import { ExtendedTransaction } from "@prisma-custom-types";
import { useCreateTransaction } from "../hooks/useCreateTransaction";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { isNull } from "lodash-es";

export const Journal = ({
  selectedDate,
  transactionsOfTheDay,
  journalState,
  journalDispatch,
}: {
  selectedDate: Date;
  transactionsOfTheDay: ExtendedTransaction[];
  journalState: JournalState;
  journalDispatch: React.Dispatch<JournalAction>;
}) => {
  const onClickAdd = () => {
    journalDispatch({
      type: "SET_IS_ADDING",
      isAdding: true,
    });
  };

  const queryClient = useQueryClient();

  const mutation = useCreateTransaction({
    onSuccess: () => {
      journalDispatch({
        type: "RESET",
      });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.GET_TRANSACTIONS, selectedDate],
      });
    },
    onError: (error) => {},
  });

  const onClickSave = () => {
    if (
      isNull(journalState.selectedDebitOption) ||
      isNull(journalState.selectedCreditOption) ||
      journalState.amount === ""
    ) {
      if (isNull(journalState.selectedDebitOption)) {
        journalDispatch({
          type: "SET_DEBIT_EMPTY",
          isDebitEmpty: true,
        });
      }
      if (isNull(journalState.selectedCreditOption)) {
        journalDispatch({
          type: "SET_CREDIT_EMPTY",
          isCreditEmpty: true,
        });
      }
      if (journalState.amount === "") {
        journalDispatch({
          type: "SET_AMOUNT_EMPTY",
          isAmountEmpty: true,
        });
      }
      return;
    }

    mutation.mutate({
      debit: {
        connect: {
          name: journalState.selectedDebitOption.name,
        },
      },
      amount: parseInt(journalState.amount),
      credit: {
        connect: {
          name: journalState.selectedCreditOption.name,
        },
      },
      date: selectedDate.toString(),
    });
  };

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
            분개장
          </Typography>
        </Toolbar>
        <TableContainer>
          <Table
            sx={{
              minWidth: 550,
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
                  차변계정
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 3}%`,
                  }}
                >
                  거래액
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    width: `${100 / 3}%`,
                  }}
                >
                  대변계정
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionsOfTheDay.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell align="center">
                    {transaction.debitAccountName}
                  </TableCell>
                  <TableCell align="center">
                    {`${transaction.amount.toLocaleString()}원`}
                  </TableCell>
                  <TableCell align="center">
                    {transaction.creditAccountName}
                  </TableCell>
                </TableRow>
              ))}
              {journalState.isAdding && (
                <AddJournalRow
                  journalState={journalState}
                  journalDispatch={journalDispatch}
                />
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} />
                <TableCell align="center">
                  <IconButton
                    onClick={journalState.isAdding ? onClickSave : onClickAdd}
                  >
                    {journalState.isAdding ? <SaveIcon /> : <PostAddIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
