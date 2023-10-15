import { startOfToday } from "date-fns";
import { useReducer } from "react";

export type DateState = {
  date: Date | null;
};

export type DateAction = {
  type: "CHANGE_DATE";
  date: Date | null;
};

function reducer(state: DateState, action: DateAction): DateState {
  switch (action.type) {
    case "CHANGE_DATE": {
      return {
        ...state,
        date: action.date,
      };
    }
    default: {
      throw new Error(`Unhandled action type`);
    }
  }
}

export const useDateReducer = () => {
  return useReducer(reducer, {
    date: startOfToday(),
  });
};
