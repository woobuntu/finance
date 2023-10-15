import { isAfter } from "date-fns";
import { isNull } from "lodash-es";
import { useReducer } from "react";

export type DateRangeState = {
  startDate: Date | null;
  endDate: Date | null;
  areDatesIncomplete: boolean;
};

export type DateRangeAction =
  | {
      type: "SET_START_DATE";
      startDate: Date;
    }
  | {
      type: "SET_END_DATE";
      endDate: Date;
    }
  | {
      type: "SET_ARE_DATES_INCOMPLETE";
      areDatesIncomplete: boolean;
    }
  | {
      type: "RESET";
    };

function reducer(
  state: DateRangeState,
  action: DateRangeAction
): DateRangeState {
  switch (action.type) {
    case "SET_START_DATE": {
      if (
        !isNull(action.startDate) &&
        !isNull(state.endDate) &&
        isAfter(action.startDate, state.endDate)
      ) {
        return {
          ...state,
          startDate: action.startDate,
          endDate: action.startDate,
        };
      }
      return {
        ...state,
        startDate: action.startDate,
      };
    }
    case "SET_END_DATE": {
      if (
        !isNull(action.endDate) &&
        !isNull(state.startDate) &&
        isAfter(state.startDate, action.endDate)
      ) {
        return {
          ...state,
          startDate: action.endDate,
          endDate: action.endDate,
        };
      }
      return {
        ...state,
        endDate: action.endDate,
      };
    }
    case "SET_ARE_DATES_INCOMPLETE": {
      return {
        ...state,
        areDatesIncomplete: action.areDatesIncomplete,
      };
    }
    case "RESET": {
      return {
        startDate: null,
        endDate: null,
        areDatesIncomplete: false,
      };
    }
  }
}

export const useDateRangeReducer = () => {
  return useReducer(reducer, {
    startDate: null,
    endDate: null,
    areDatesIncomplete: false,
  });
};
