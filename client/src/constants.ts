export const QUERY_KEYS = {
  GET_ACCOUNTS: ["accounts"],
  GET_ACCOUNT_OPTIONS: ["accounts", "options"],
  GET_TRANSACTIONS: ["transactions"],
  GET_PERIODIC_TRANSACTIONS: ["transactions", "periodic"],
} as const;

export const PAGES = {
  CALENDAR: "재무상태표",
  ACCOUNTS: "계정과목 관리",
  TRANSACTIONS: "정기 거래 관리",
  INCOME_STATEMENT: "손익계산서",
} as const;

export type Page = (typeof PAGES)[keyof typeof PAGES];

export const INTERVAL_OPTIONS = ["매일", "매주", "매월", "매년"] as const;
export type IntervalOption = (typeof INTERVAL_OPTIONS)[number];
