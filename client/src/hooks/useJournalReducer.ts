import { useEffect, useReducer } from "react";
import { AccountOption, useGetAccountOptions } from "./useGetAccountOptions";
import { isUndefined } from "lodash-es";

export type JournalState = {
  debitOptions: AccountOption[];
  creditOptions: AccountOption[];
  selectedDebitOption: AccountOption | null;
  selectedCreditOption: AccountOption | null;
  isDebitEmpty: boolean;
  isCreditEmpty: boolean;
  isAmountEmpty: boolean;
  amount: string;
  isAdding: boolean;
};

export type JournalAction =
  | {
      type: "INIT_OPTIONS";
      options: AccountOption[];
    }
  | {
      type: "SELECT_DEBIT";
      selectedOption: AccountOption | null;
    }
  | {
      type: "SELECT_CREDIT";
      selectedOption: AccountOption | null;
    }
  | {
      type: "CHANGE_AMOUNT";
      amount: string;
    }
  | {
      type: "RESET";
    }
  | {
      type: "SET_DEBIT_EMPTY";
      isDebitEmpty: boolean;
    }
  | {
      type: "SET_CREDIT_EMPTY";
      isCreditEmpty: boolean;
    }
  | {
      type: "SET_AMOUNT_EMPTY";
      isAmountEmpty: boolean;
    }
  | {
      type: "SET_IS_ADDING";
      isAdding: boolean;
    };

function reducer(state: JournalState, action: JournalAction): JournalState {
  switch (action.type) {
    case "SET_IS_ADDING": {
      return {
        ...state,
        isAdding: action.isAdding,
      };
    }
    case "INIT_OPTIONS": {
      return {
        ...state,
        debitOptions: action.options,
        creditOptions: action.options,
      };
    }
    case "SELECT_DEBIT": {
      if (state.selectedCreditOption?.name === action.selectedOption?.name) {
        return {
          ...state,
          isDebitEmpty: false,
          selectedDebitOption: action.selectedOption,
          selectedCreditOption: null,
        };
      }

      return {
        ...state,
        isDebitEmpty: false,
        selectedDebitOption: action.selectedOption,
      };
    }
    case "SELECT_CREDIT": {
      if (state.selectedDebitOption?.name === action.selectedOption?.name) {
        return {
          ...state,
          isCreditEmpty: false,
          selectedDebitOption: null,
          selectedCreditOption: action.selectedOption,
        };
      }

      return {
        ...state,
        isCreditEmpty: false,
        selectedCreditOption: action.selectedOption,
      };
    }
    case "CHANGE_AMOUNT": {
      return {
        ...state,
        isAmountEmpty: false,
        amount: action.amount,
      };
    }
    case "RESET": {
      return {
        ...state,
        isAdding: false,
        selectedDebitOption: null,
        selectedCreditOption: null,
        isAmountEmpty: false,
        isCreditEmpty: false,
        isDebitEmpty: false,
        amount: "",
      };
    }
    case "SET_DEBIT_EMPTY": {
      return {
        ...state,
        isDebitEmpty: action.isDebitEmpty,
      };
    }
    case "SET_CREDIT_EMPTY": {
      return {
        ...state,
        isCreditEmpty: action.isCreditEmpty,
      };
    }
    case "SET_AMOUNT_EMPTY": {
      return {
        ...state,
        isAmountEmpty: action.isAmountEmpty,
      };
    }
  }
}

export const useJournalReducer = () => {
  const { data, isLoading } = useGetAccountOptions();

  const [state, dispatch] = useReducer(reducer, {
    debitOptions: [],
    creditOptions: [],
    selectedDebitOption: null,
    selectedCreditOption: null,
    amount: "",
    isDebitEmpty: false,
    isCreditEmpty: false,
    isAmountEmpty: false,
    isAdding: false,
  });

  useEffect(() => {
    if (isUndefined(data)) return;

    dispatch({
      type: "INIT_OPTIONS",
      options: data,
    });
  }, [data]);

  return {
    isLoading,
    journalState: state,
    journalDispatch: dispatch,
  };
};
