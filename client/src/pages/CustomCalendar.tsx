import { Container, Stack } from "@mui/material";
import { Fragment } from "react";
import { DateCalendar } from "@mui/x-date-pickers";
import { Journal } from "../components/Journal";
import { useDateReducer } from "../hooks/useDateReducer";
import { AccumulatedJournal } from "../components/AccumulatedJournal";
import { useGetTransactions } from "../hooks/useGetTransactions";
import { endOfToday, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";
import { isNull, isUndefined } from "lodash-es";
import { useJournalReducer } from "../hooks/useJournalReducer";
import { BalanceSheet } from "../components/BalanceSheet";

export const CustomCalendar = () => {
  const [dateState, dateDispatch] = useDateReducer();

  const { data } = useGetTransactions({
    startDate: dateState.date,
    endDate: dateState.date,
    accountName: null,
  });

  const { journalState, journalDispatch } = useJournalReducer();

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
            journalDispatch({
              type: "RESET",
            });

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
      <Container maxWidth="lg">
        <Stack spacing={2}>
          {!isNull(dateState.date) && (
            <Journal
              journalState={journalState}
              journalDispatch={journalDispatch}
              selectedDate={dateState.date}
              transactionsOfTheDay={
                isUndefined(data)
                  ? []
                  : data.filter((transaction) => {
                      if (isNull(dateState.date)) return false;
                      return isSameDay(
                        new Date(transaction.date),
                        new Date(dateState.date)
                      );
                    })
              }
            />
          )}
          {!isUndefined(data) &&
            !isNull(dateState.date) &&
            isAfter(dateState.date, endOfToday()) && (
              <AccumulatedJournal
                accumulatedTransactions={data.filter((transaction) => {
                  if (isNull(dateState.date)) return false;
                  return isBefore(
                    new Date(transaction.date),
                    new Date(dateState.date)
                  );
                })}
              />
            )}
        </Stack>

        {!isNull(dateState.date) && <BalanceSheet date={dateState.date} />}
      </Container>
    </Fragment>
  );
};
