import { Container, Divider, Stack } from "@mui/material";
import { Fragment } from "react";
import { DateCalendar } from "@mui/x-date-pickers";
import { Journal } from "../components/Journal";
import { useDateReducer } from "../hooks/useDateReducer";
import { useGetTransactions } from "../hooks/useGetTransactions";
import { endOfDay, isSameDay, startOfDay } from "date-fns";
import { isNull, isUndefined } from "lodash-es";
import { BalanceSheet } from "../components/BalanceSheet";
import { IncomeStatement } from "../components/IncomeStatement";
import { TransactionForm } from "../components/TransactionForm";

export const DayView = () => {
  const [dateState, dateDispatch] = useDateReducer();

  const { data } = useGetTransactions({
    startDate: dateState.date,
    endDate: dateState.date,
    accountName: null,
  });

  return (
    <Fragment>
      <Container maxWidth="sm" component="main">
        <DateCalendar
          value={dateState.date}
          onChange={(newDate) => {
            dateDispatch({
              type: "CHANGE_DATE",
              date: isNull(newDate) ? null : startOfDay(newDate),
            });
          }}
          onFocusedViewChange={() => {
            console.log("DateCalendar onFocusedViewChange");
          }}
          onMonthChange={() => {
            console.log("DateCalendar onMonthChange");
          }}
          onViewChange={() => {
            console.log("DateCalendar onViewChange");
          }}
          onYearChange={() => {
            console.log("DateCalendar onYearChange");
          }}
        />
      </Container>

      <Container maxWidth="sm">
        <Stack spacing={2}>
          <Divider />

          {!isNull(dateState.date) && <BalanceSheet date={dateState.date} />}

          <Divider />

          {!isNull(dateState.date) && (
            <IncomeStatement
              startDate={startOfDay(dateState.date)}
              endDate={startOfDay(dateState.date)}
            />
          )}

          <Divider />

          {!isNull(dateState.date) && !isUndefined(data) && (
            <Journal transactions={data} selectedDate={dateState.date} />
          )}
          <Divider />

          {!isNull(dateState.date) && (
            <TransactionForm selectedDate={dateState.date} />
          )}
        </Stack>
      </Container>
    </Fragment>
  );
};
