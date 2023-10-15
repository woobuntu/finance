import { Container, Stack } from "@mui/material";
import { EnrolledPeriodicTransactions } from "../components/EnrolledPeriodicTransactions";
import { PeriodicTransactionForm } from "../components/PeriodicTransactionForm";

export const PeriodicTransactions = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Stack spacing={2}>
        <PeriodicTransactionForm />

        <EnrolledPeriodicTransactions />
      </Stack>
    </Container>
  );
};
