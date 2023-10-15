import { isUndefined } from "lodash-es";
import { AccountProps } from "../components/Account";

export const getBalance: (props: AccountProps) => number = (
  props: AccountProps
) => {
  const {
    childAccounts,
    side,
    debitRelatedTransactions,
    creditRelatedTransactions,
  } = props;

  let ownBalance = 0;

  if (side === "DEBIT") {
    ownBalance += debitRelatedTransactions.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );
    ownBalance -= creditRelatedTransactions.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );
  } else {
    ownBalance += creditRelatedTransactions.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );
    ownBalance -= debitRelatedTransactions.reduce(
      (acc, cur) => acc + cur.amount,
      0
    );
  }

  if (isUndefined(childAccounts) || childAccounts.length === 0) {
    return ownBalance;
  }

  return childAccounts.reduce((acc, cur) => acc + getBalance(cur), ownBalance);
};
