import { Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import { AccountsTree } from "./AccountsTree";
import { AccountForm } from "./AccountForm";

export const Accounts = ({ endDate }: { endDate: Date }) => {
  const [tabValue, setTabValue] = useState<number>(0);

  const onChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={onChange}>
          <Tab label="form 뷰" />
          <Tab label="tree 뷰" />
        </Tabs>
        <div role="tabpanel">
          {tabValue === 0 ? (
            <AccountForm />
          ) : (
            <AccountsTree endDate={endDate} />
          )}
        </div>
      </Box>
    </Box>
  );
};
