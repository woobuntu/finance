import {
  Autocomplete,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ExtendedTransaction } from "@prisma-custom-types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";
import { TransactionRow } from "./TransactionRow";
import { useGetTags } from "../hooks/useGetTags";
import { isNull, isUndefined } from "lodash-es";

export const Journal = ({
  transactions,
  selectedDate,
}: {
  transactions: ExtendedTransaction[];
  selectedDate: Date;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  const { data, isLoading: isTagLoading } = useGetTags();

  const [tagToFilter, setTagToFilter] = useState<string | null>(null);

  const onChangeFilterTag = (event: any, newValue: string | null) => {
    setTagToFilter(newValue);
  };

  const sumOfTransactions = transactions
    .filter(({ transactionTags }) => {
      if (isNull(tagToFilter)) return true;
      return transactionTags.some(({ tagName }) => tagName === tagToFilter);
    })
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  return (
    <Stack direction="column" spacing={2}>
      <Stack direction="row" paddingX={2} justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton onClick={toggleIsOpen}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>

          <Typography variant="h6">거래내역</Typography>
        </Stack>

        {!isTagLoading && !isUndefined(data) && (
          <Autocomplete
            value={tagToFilter}
            onChange={onChangeFilterTag}
            options={data.map((tag) => tag.name)}
            sx={{ width: 150 }}
            renderInput={(params) => (
              <TextField {...params} label="태그 필터" />
            )}
          />
        )}
      </Stack>
      <Collapse in={isOpen}>
        <Stack direction="column" spacing={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell
                    align="center"
                    sx={{
                      width: "45%",
                    }}
                  >
                    메모
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "45%",
                    }}
                  >
                    거래액
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions
                  .filter(({ transactionTags }) => {
                    if (isNull(tagToFilter)) return true;
                    return transactionTags.some(
                      ({ tagName }) => tagName === tagToFilter
                    );
                  })
                  .map((transaction) => (
                    <TransactionRow
                      key={transaction.id}
                      transaction={transaction}
                      selectedDate={selectedDate}
                    />
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell align="center">합계</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      width: "45%",
                    }}
                  />
                  <TableCell
                    align="center"
                    sx={{
                      width: "45%",
                    }}
                  >
                    {`${sumOfTransactions.toLocaleString()}원`}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Stack>
      </Collapse>
    </Stack>
  );
};
