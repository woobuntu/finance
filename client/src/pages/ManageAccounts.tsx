import { Container, Stack, Typography } from "@mui/material";
import { startOfToday, startOfYear } from "date-fns";
import { GeneralLedger } from "../components/GeneralLedger";
import { Accounts } from "../components/Accounts";

export const ManageAccounts = () => {
  const date = startOfToday();
  return (
    <Container component="main" maxWidth="sm">
      <Stack direction="column">
        <Typography variant="h6">계정과목 편집</Typography>
        <Accounts endDate={date} />
        <Typography variant="h6" marginY={2}>
          총계정원장
        </Typography>
        <GeneralLedger startDate={startOfYear(date)} endDate={date} />
      </Stack>
    </Container>
  );
};
