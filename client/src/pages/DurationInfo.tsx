import { Container, Divider, Stack } from "@mui/material";
import { IncomeStatement } from "../components/IncomeStatement";
import { DatePicker } from "@mui/x-date-pickers";
import { useDateRangeReducer } from "../hooks/useDateRangeReducer";
import { isNull, isUndefined } from "lodash-es";
import React from "react";
import { Journal } from "../components/Journal";
import { useGetTransactions } from "../hooks/useGetTransactions";
import { startOfToday } from "date-fns";

export const DurationInfo = () => {
  const [dateRangeState, dateRangeDispatch] = useDateRangeReducer();

  const onChangeStartDate = (date: Date | null) => {
    if (isNull(date)) {
      return;
    }
    dateRangeDispatch({
      type: "SET_START_DATE",
      startDate: date,
    });
  };

  const onChangeEndDate = (date: Date | null) => {
    if (isNull(date)) {
      return;
    }
    dateRangeDispatch({
      type: "SET_END_DATE",
      endDate: date,
    });
  };

  const { data } = useGetTransactions({
    startDate: dateRangeState.startDate,
    endDate: dateRangeState.endDate,
    accountName: null,
  });

  return (
    <Container component="main" maxWidth="sm">
      <Stack direction="column" spacing={2} paddingBottom={3}>
        <Stack direction="column" spacing={2}>
          <DatePicker
            sx={{
              width: "100%",
            }}
            label="시작일"
            value={dateRangeState.startDate}
            onChange={onChangeStartDate}
          />

          <DatePicker
            sx={{
              width: "100%",
            }}
            label="종료일"
            value={dateRangeState.endDate}
            onChange={onChangeEndDate}
          />
        </Stack>

        {!isNull(dateRangeState.startDate) &&
          !isNull(dateRangeState.endDate) && (
            <React.Fragment>
              <IncomeStatement
                startDate={dateRangeState.startDate}
                endDate={dateRangeState.endDate}
              />
              <Divider />
            </React.Fragment>
          )}

        {!isNull(dateRangeState.startDate) &&
          !isNull(dateRangeState.endDate) &&
          !isUndefined(data) && (
            <Journal transactions={data} selectedDate={startOfToday()} />
          )}
      </Stack>
    </Container>
  );
};
