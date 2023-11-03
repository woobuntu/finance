import { Container, Stack } from "@mui/material";
import { Accounts } from "../components/Accounts";
import { startOfToday, startOfYear } from "date-fns";
import { GeneralLedger } from "../components/GeneralLedger";

export const ManageAccounts = () => {
  const date = startOfToday();
  return (
    <Container component="main" maxWidth="sm">
      <Stack direction="column" spacing={2}>
        <Accounts endDate={date} />
        <GeneralLedger startDate={startOfYear(date)} endDate={date} />
      </Stack>
    </Container>
  );
};
