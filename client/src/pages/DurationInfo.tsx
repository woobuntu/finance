import { Container, Stack } from "@mui/material";
import { IncomeStatement } from "../components/IncomeStatement";
import { DatePicker } from "@mui/x-date-pickers";
import { useDateRangeReducer } from "../hooks/useDateRangeReducer";
import { isNull } from "lodash-es";

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

  return (
    <Container component="main" maxWidth="md">
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
      >
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

      {!isNull(dateRangeState.startDate) && !isNull(dateRangeState.endDate) && (
        <IncomeStatement
          startDate={dateRangeState.startDate}
          endDate={dateRangeState.endDate}
        />
      )}
    </Container>
  );
};
