import { useEffect, useReducer } from "react";
import { AccountOption, useGetAccountOptions } from "./useGetAccountOptions";
import { isUndefined } from "lodash-es";
import { TransactionType } from "../constants";
import { TagOption } from "./useGetTags";

export type TransactionFormState = {
  transactionFormType: TransactionType;
  debitOptions: AccountOption[];
  creditOptions: AccountOption[];
  selectedDebitOption: AccountOption | null;
  amount: string;
  selectedCreditOption: AccountOption | null;
  note: string;
  tags: TagOption[];
  installmentPeriod?: string;
  isDebitEmpty: boolean;
  isAmountEmpty: boolean;
  isCreditEmpty: boolean;
  isNoteEmpty: boolean;
  isInstallmentPeriodEmpty: boolean;
  isAdding: boolean;
};

export type TransactionFormAction =
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
      type: "CHANGE_NOTE";
      note: string;
    }
  | {
      type: "CHANGE_INSTALLMENT_PERIOD";
      installmentPeriod: string;
    }
  | {
      type: "CHANGE_TAGS";
      tags: TagOption[];
    }
  | {
      type: "RESET";
    }
  | {
      type: "SET_DEBIT_EMPTY";
      isDebitEmpty: boolean;
    }
  | {
      type: "SET_AMOUNT_EMPTY";
      isAmountEmpty: boolean;
    }
  | {
      type: "SET_CREDIT_EMPTY";
      isCreditEmpty: boolean;
    }
  | {
      type: "SET_NOTE_EMPTY";
      isNoteEmpty: boolean;
    }
  | {
      type: "SET_INSTALLMENT_PERIOD_EMPTY";
      isInstallmentPeriodEmpty: boolean;
    }
  | {
      type: "SET_IS_ADDING";
      isAdding: boolean;
    };

function reducer(
  state: TransactionFormState,
  action: TransactionFormAction
): TransactionFormState {
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
    case "CHANGE_NOTE": {
      return {
        ...state,
        note: action.note,
        isNoteEmpty: false,
      };
    }
    case "CHANGE_INSTALLMENT_PERIOD": {
      return {
        ...state,
        installmentPeriod: action.installmentPeriod,
        isInstallmentPeriodEmpty: false,
      };
    }
    case "RESET": {
      return {
        ...state,
        selectedDebitOption: null,
        selectedCreditOption: null,
        amount: "",
        note: "",
        tags: [],
        installmentPeriod: undefined,
        isDebitEmpty: false,
        isAmountEmpty: false,
        isCreditEmpty: false,
        isNoteEmpty: false,
        isInstallmentPeriodEmpty: false,
        isAdding: false,
      };
    }
    case "SET_DEBIT_EMPTY": {
      return {
        ...state,
        isDebitEmpty: action.isDebitEmpty,
      };
    }
    case "SET_AMOUNT_EMPTY": {
      return {
        ...state,
        isAmountEmpty: action.isAmountEmpty,
      };
    }
    case "SET_CREDIT_EMPTY": {
      return {
        ...state,
        isCreditEmpty: action.isCreditEmpty,
      };
    }
    case "SET_NOTE_EMPTY": {
      return {
        ...state,
        isNoteEmpty: action.isNoteEmpty,
      };
    }
    case "SET_INSTALLMENT_PERIOD_EMPTY": {
      return {
        ...state,
        isInstallmentPeriodEmpty: action.isInstallmentPeriodEmpty,
      };
    }
    case "CHANGE_TAGS": {
      return {
        ...state,
        tags: action.tags,
      };
    }
  }
}

export const useTransactionFormReducer = () => {
  const { data, isLoading } = useGetAccountOptions();

  const [state, dispatch] = useReducer(reducer, {
    transactionFormType: "카드 일시불 거래",
    debitOptions: [],
    creditOptions: [],
    selectedDebitOption: null,
    amount: "",
    selectedCreditOption: null,
    note: "",
    tags: [],
    installmentPeriod: undefined,
    isDebitEmpty: false,
    isAmountEmpty: false,
    isCreditEmpty: false,
    isNoteEmpty: false,
    isInstallmentPeriodEmpty: false,
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
    transactionFormState: state,
    transactionFormDispatch: dispatch,
    transactionFormIsLoading: isLoading,
  };
};
