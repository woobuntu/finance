import { CircularProgress, Stack } from "@mui/material";
import { useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { CustomAppBar } from "./CustomAppBar";
import { PAGES, Page } from "../constants";
import { CustomCalendar } from "../pages/CustomCalendar";
import { ManageAccounts } from "../pages/ManageAccounts";
import { PeriodicTransactions } from "../pages/PeriodicTransactions";
import { DurationInfo } from "../pages/DurationInfo";

export const Main = ({
  themeMode,
  toggleThemeMode,
}: {
  themeMode: "light" | "dark";
  toggleThemeMode: () => void;
}) => {
  const fetchingMutationCount = useIsMutating();

  const fetchingQueryCount = useIsFetching();

  const [page, setPage] = useState<Page>(PAGES.CALENDAR);

  const onClickMenu = (page: Page) => {
    setPage(page);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  return (
    <Stack
      direction="column"
      spacing={3}
      alignItems="center"
      sx={{
        position: "relative",
      }}
    >
      {(fetchingMutationCount > 0 || fetchingQueryCount > 0) && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100,
          }}
        />
      )}
      <CustomAppBar
        themeMode={themeMode}
        isDrawerOpen={isDrawerOpen}
        toggleThemeMode={toggleThemeMode}
        onClickMenu={onClickMenu}
        toggleDrawer={toggleDrawer}
      />
      {page === PAGES.CALENDAR && <CustomCalendar />}
      {page === PAGES.ACCOUNTS && <ManageAccounts />}
      {page === PAGES.TRANSACTIONS && <PeriodicTransactions />}
      {page === PAGES.INCOME_STATEMENT && <DurationInfo />}
    </Stack>
  );
};
