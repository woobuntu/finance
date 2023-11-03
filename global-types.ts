import { Prisma } from "@prisma/client";

export type DummyType = string;

export type RootAccounts = Prisma.AccountGetPayload<{
  include: {
    debitRelatedTransactions: true;
    creditRelatedTransactions: true;
    childAccounts: {
      include: {
        debitRelatedTransactions: true;
        creditRelatedTransactions: true;
        childAccounts: {
          include: {
            debitRelatedTransactions: true;
            creditRelatedTransactions: true;
            childAccounts: {
              include: {
                debitRelatedTransactions: true;
                creditRelatedTransactions: true;
              };
            };
          };
        };
      };
    };
  };
}>[];

export type CreateAccountDTO = Pick<
  Prisma.AccountCreateInput,
  "name" | "parentAccount" | "side"
>;

export type ExtendedTransaction = Prisma.TransactionGetPayload<{
  include: {
    debit: {
      select: {
        side: true;
      };
    };
    credit: {
      select: {
        side: true;
      };
    };
    transactionTags: true;
  };
}>;

export type CreateTransactionDTO = Prisma.TransactionCreateInput & {
  installmentPeriod?: string;
};
