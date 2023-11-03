import {
  Alert,
  Button,
  ButtonGroup,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  TextField,
} from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

import RemoveIcon from "@mui/icons-material/Remove";
import { Prisma } from "@prisma/client";
import { useCreateAccount } from "../hooks/useCreateAccount";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { isUndefined } from "lodash-es";
import { isNestException } from "../utils/isNestException";
import { getBalance } from "../utils/getBalance";
import { useDeleteAccount } from "../hooks/useDeleteAccount";
import React from "react";

type AccountWithDepth = Prisma.AccountGetPayload<{
  include: {
    debitRelatedTransactions: true;
    creditRelatedTransactions: true;
  };
}> & {
  depth: number;
  mode: "VIEW" | "EDIT";
};

export type AccountProps = AccountWithDepth & {
  childAccounts?: AccountProps[];
};

export const Account = (props: AccountProps) => {
  const { name, childAccounts, depth, side, mode } = props;

  const [open, setOpen] = useState<boolean>(false);

  const shouldShowExpandLessIcon =
    !isUndefined(childAccounts) && childAccounts.length > 0 && open;

  const shouldShowExpandMoreIcon =
    !isUndefined(childAccounts) && childAccounts.length > 0 && !open;

  const [isAdding, setIsAdding] = useState<boolean>(false);

  const onClickCreateAccount = () => {
    if (!open) setOpen(true);
    setIsAdding(true);
  };

  const [newAccount, setNewAccount] = useState<string>("");

  const [isError, setIsError] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const onChangeNewAccount = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      setIsError(false);
      setErrorMessage("");
    }
    setNewAccount(event.target.value);
  };

  const queryClient = useQueryClient();

  const createAccountMutation = useCreateAccount({
    onSuccess: () => {
      setIsAdding(false);
      setNewAccount("");
      setIsError(false);
      setErrorMessage("");
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_ACCOUNTS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_ACCOUNT_OPTIONS,
      });
    },
    onError: (error: any) => {
      if (isNestException(error)) {
        setIsError(true);
        setErrorMessage(error.response.data.message);
      } else {
        setIsError(true);
        setErrorMessage(error.message);
      }
    },
  });

  const onClickSave = () => {
    if (newAccount === "") {
      setIsError(true);
      setErrorMessage("계정과목 이름을 입력해주세요.");
      return;
    }

    createAccountMutation.mutate({
      name: newAccount,
      side,
      parentAccount: {
        connect: {
          name,
        },
      },
    });
  };

  const deleteAccountMutation = useDeleteAccount({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_ACCOUNTS,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.GET_ACCOUNT_OPTIONS,
      });
    },
    onError: (error: any) => {
      alert(error);
    },
  });

  const deleteAccount = () => {
    deleteAccountMutation.mutate({
      name,
    });
  };

  useEffect(() => {
    if (!open) {
      setIsAdding(false);
      setNewAccount("");
      setIsError(false);
      setErrorMessage("");
    }
  }, [open]);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);

  const openSnackbar = () => {
    setIsSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  const action = (
    <React.Fragment>
      <ButtonGroup size="small">
        <Button color="error" onClick={deleteAccount}>
          O
        </Button>
        <Button color="inherit" onClick={closeSnackbar}>
          X
        </Button>
      </ButtonGroup>
    </React.Fragment>
  );

  return (
    <Fragment>
      <ListItem sx={{ pl: 4 * depth }}>
        <ListItemIcon>
          <IconButton onClick={() => setOpen(!open)}>
            {shouldShowExpandLessIcon && <ExpandLess />}
            {shouldShowExpandMoreIcon && <ExpandMore />}
          </IconButton>
        </ListItemIcon>

        <ListItemText
          primary={name}
          secondary={`${getBalance(props).toLocaleString()}원`}
        />

        {/* depth 한계에서는 안 보여야 함 */}
        {mode === "EDIT" && depth < 3 && (
          <IconButton onClick={onClickCreateAccount}>
            <AddIcon />
          </IconButton>
        )}

        {mode === "EDIT" &&
          depth > 0 &&
          !isUndefined(childAccounts) &&
          childAccounts.length === 0 && (
            <IconButton onClick={openSnackbar}>
              <RemoveIcon />
            </IconButton>
          )}
        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={6000}
          onClose={closeSnackbar}
        >
          <Alert severity="error" sx={{ width: "100%" }} action={action}>
            정말로 삭제하시겠습니까?
          </Alert>
        </Snackbar>
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {childAccounts?.map((childAccount) => (
            <Account
              key={childAccount.name}
              {...childAccount}
              depth={depth + 1}
              mode={mode}
            />
          ))}
          {isAdding && (
            <Fragment>
              <ListItem
                sx={{
                  pl: 4 * (depth + 1),
                }}
              >
                <ListItemIcon />

                <TextField
                  autoFocus
                  variant="filled"
                  error={isError}
                  value={newAccount}
                  helperText={errorMessage}
                  onChange={onChangeNewAccount}
                  disabled={createAccountMutation.isLoading}
                />

                <ListItemText />

                <IconButton onClick={onClickSave}>
                  <SaveIcon />
                </IconButton>
              </ListItem>
            </Fragment>
          )}
        </List>
      </Collapse>
    </Fragment>
  );
};
