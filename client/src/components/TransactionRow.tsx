import {
  Alert,
  Autocomplete,
  Button,
  ButtonGroup,
  Collapse,
  IconButton,
  Snackbar,
  Stack,
  TableCell,
  TableRow,
  TextField,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { ExtendedTransaction } from "@prisma-custom-types";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useDeleteTransaction } from "../hooks/useDeleteTransaction";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { isBefore } from "date-fns";
import { isUndefined } from "lodash-es";

export const TransactionRow = ({
  transaction,
  selectedDate,
}: {
  transaction: ExtendedTransaction;
  selectedDate: Date;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const openSnackbar = () => {
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const queryClient = useQueryClient();

  const mutation = useDeleteTransaction({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_TRANSACTIONS,
      });
      closeSnackbar();
    },
    onError: (error) => {
      alert(error);
    },
  });

  const deleteTransaction = () => {
    mutation.mutate(transaction.id);
  };

  const isBeforeSelectedDate = isBefore(
    new Date(transaction.date),
    new Date(selectedDate)
  );

  const action = (
    <React.Fragment>
      <ButtonGroup size="small">
        <Button color="error" onClick={deleteTransaction}>
          O
        </Button>
        <Button color="inherit" onClick={closeSnackbar}>
          X
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: isBeforeSelectedDate
      ? theme.palette.primary.contrastText
      : "unset",
  }));

  return (
    <React.Fragment>
      <StyledTableRow>
        <TableCell>
          <IconButton size="small" onClick={toggleIsOpen}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center">{transaction.note}</TableCell>
        <TableCell align="center">{`${transaction.amount.toLocaleString()}원`}</TableCell>
      </StyledTableRow>
      <StyledTableRow>
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
                variant="outlined"
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

              <TextField
                label="태그"
                disabled
                value={transaction.transactionTags
                  .map(({ tagName }) => tagName)
                  .join(", ")}
              />

              <Button color="error" onClick={openSnackbar}>
                삭제
              </Button>
              <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={6000}
                onClose={closeSnackbar}
              >
                <Alert severity="error" sx={{ width: "100%" }} action={action}>
                  정말로 삭제하시겠습니까?
                </Alert>
              </Snackbar>
            </Stack>
          </Collapse>
        </TableCell>
      </StyledTableRow>
    </React.Fragment>
  );
};
