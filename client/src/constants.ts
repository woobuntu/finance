export const QUERY_KEYS = {
  GET_ACCOUNTS: ["accounts"],
  GET_ACCOUNT_OPTIONS: ["accounts", "options"],
  GET_TRANSACTIONS: ["transactions"],
  GET_PERIODIC_TRANSACTIONS: ["transactions", "periodic"],
  GET_TAGS: ["tags"],
} as const;

export const PAGES = {
  DAYS: "일일조회",
  PERIODS: "기간조회",
  GENERAL_LEDGER: "총계정원장",
  TRANSACTIONS: "정기 거래 관리",
} as const;

export type Page = (typeof PAGES)[keyof typeof PAGES];

export const INTERVAL_OPTIONS = ["매일", "매주", "매월", "매년"] as const;
export type IntervalOption = (typeof INTERVAL_OPTIONS)[number];

export const TRANSACTION_TYPES = [
  "이체 거래",
  "카드 일시불 거래",
  "카드 할부 거래",
  "그외 기타 분개",
] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];
