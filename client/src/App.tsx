import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";
import { Main } from "./components/Main";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import koLocale from "date-fns/locale/ko";

const queryClient = new QueryClient();

function App() {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark"); // "light" | "dark

  const toggleThemeMode = () => {
    setThemeMode((prevThemeMode) =>
      prevThemeMode === "dark" ? "light" : "dark"
    );
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const lightTheme = createTheme();

  return (
    <ThemeProvider theme={themeMode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={koLocale}
        >
          <Main themeMode={themeMode} toggleThemeMode={toggleThemeMode} />
        </LocalizationProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
