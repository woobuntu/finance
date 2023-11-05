import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from '@prisma-custom-types';
import { Prisma } from '@prisma/client';
import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  endOfDay,
  endOfToday,
  getDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  nextDay,
  startOfTomorrow,
} from 'date-fns';
import {
  add,
  divide,
  isEqual,
  isNull,
  isString,
  isUndefined,
  lte,
  toNumber,
} from 'lodash';
import { AccountService } from 'src/account/account.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getKoreanTime } from 'src/utils/getKoreanTime';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
  ) {}

  async getTransactions({
    startDate,
    endDate,
    accountName,
  }: {
    startDate: Date;
    endDate: Date;
    accountName?: string;
  }) {
    const accountNameSelector = isUndefined(accountName)
      ? {}
      : {
          OR: [
            {
              creditAccountName: accountName,
            },
            {
              debitAccountName: accountName,
            },
          ],
        };

    const dateSelector = !isEqual(startDate, endDate)
      ? {
          date: {
            gte: startDate,
            lte: endDate,
          },
        }
      : isBefore(endDate, getKoreanTime(startOfTomorrow()))
      ? {
          date: endDate,
        }
      : {
          date: {
            gte: new Date(startOfTomorrow().toString().replace(/\+/, ' ')),
            lte: addDays(getKoreanTime(endDate), 1),
          },
        };

    return this.prisma.transaction.findMany({
      where: {
        ...dateSelector,
        ...accountNameSelector,
      },
      include: {
        debit: {
          select: {
            side: true,
          },
        },
        credit: {
          select: {
            side: true,
          },
        },
        transactionTags: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async createTransaction(transaction: CreateTransactionDTO) {
    const credit = await this.prisma.account.findUnique({
      where: {
        name: transaction.credit.connect.name,
      },
      include: {
        parentAccount: true,
      },
    });

    if (
      !isNull(credit.parentAccount) &&
      credit.parentAccount.name === '카드부채'
    ) {
      if (!isUndefined(transaction.installmentPeriod)) {
        const {
          installmentPeriod,
          ...transactionDataWithoutInstallmentPeriod
        } = transaction;

        // 카드 할부 거래
        const numberedInstallmentPeriod = toNumber(installmentPeriod);

        const transactions = Array.from(
          {
            length: numberedInstallmentPeriod,
          },
          (v, i) => addMonths(transaction.date as Date, i),
        ).map((transactionDate) => {
          const day = getDate(transactionDate);

          const nextMonth = addMonths(transactionDate, 1);

          const theMonthAfterNextMonth = addMonths(transactionDate, 2);

          const year = lte(day, 17)
            ? getYear(nextMonth)
            : getYear(theMonthAfterNextMonth);

          const month = add(
            lte(day, 17)
              ? getMonth(nextMonth)
              : getMonth(theMonthAfterNextMonth),
            1,
          );

          const creditAccountName = `${credit.name}_${year}.${month}`;

          return this.prisma.transaction.create({
            data: {
              ...transactionDataWithoutInstallmentPeriod,
              amount: divide(transaction.amount, numberedInstallmentPeriod),
              credit: {
                connectOrCreate: {
                  where: {
                    name: creditAccountName,
                  },
                  create: {
                    name: creditAccountName,
                    parentAccount: {
                      connect: {
                        name: credit.name,
                      },
                    },
                    side: 'CREDIT',
                  },
                },
              },
            },
          });
        });

        return this.prisma.$transaction(transactions);
      }
      // 카드 일시불 거래

      const day = getDate(transaction.date as Date);

      const nextMonth = addMonths(transaction.date as Date, 1);

      const theMonthAfterNextMonth = addMonths(transaction.date as Date, 2);

      const year = lte(day, 17)
        ? getYear(nextMonth)
        : getYear(theMonthAfterNextMonth);

      const month = add(
        lte(day, 17) ? getMonth(nextMonth) : getMonth(theMonthAfterNextMonth),
        1,
      );

      const creditAccountName = `${credit.name}_${year}.${month}`;

      return this.prisma.transaction.create({
        data: {
          ...transaction,
          credit: {
            connectOrCreate: {
              where: {
                name: creditAccountName,
              },
              create: {
                name: creditAccountName,
                parentAccount: {
                  connect: {
                    name: credit.name,
                  },
                },
                side: 'CREDIT',
              },
            },
          },
        },
      });
    }
    // 일반 거래
    return this.prisma.transaction.create({
      data: transaction,
    });
  }

  async deleteTransaction(where: Prisma.TransactionWhereUniqueInput) {
    return this.prisma.transaction.delete({
      where,
    });
  }

  async getPeriodicTransactions() {
    return this.prisma.periodicTransaction.findMany();
  }

  async createPeriodicTransaction(
    transaction: Prisma.PeriodicTransactionCreateInput,
  ) {
    const { debit, credit, amount, interval, startDate, endDate } = transaction;

    if (isString(startDate) || isString(endDate)) {
      throw new Error('날짜가 문자열로 입력되었습니다.');
    }
    const createPeriodicTransaction = this.prisma.periodicTransaction.create({
      data: transaction,
    });

    const nextPeriodicTransactionId =
      (await this.prisma.periodicTransaction.findMany()).length + 1;

    const lastTransactionId = (
      await this.prisma.transaction.findMany({
        orderBy: {
          id: 'desc',
        },
        take: 1,
      })
    )[0].id;

    if (
      (await this.accountService.haveParentAccount({
        accountName: debit.connect.name,
        parentAccountName: '비용',
      })) &&
      (await this.accountService.haveParentAccount({
        accountName: credit.connect.name,
        parentAccountName: '카드부채',
      })) &&
      interval === 'MONTHLY'
    ) {
      if (getDate(endDate) !== getDate(startDate)) {
        throw new Error('시작일과 종료일의 일자가 다릅니다.');
      }

      if (
        credit.connect.name !== '카드부채(신한)' &&
        credit.connect.name !== '카드부채(국민)'
      ) {
        throw new Error('카드부채가 아닙니다.');
      }

      let date = startDate;

      const dates = [];

      while (!isAfter(date, endDate)) {
        dates.push(date);
        date = addMonths(date, 1);
      }

      const today = getKoreanTime(new Date());

      const transactions = dates
        .filter((date) => !isBefore(date, today))
        .map((date) => {
          const creditAccountName =
            getDate(date) < 18
              ? `${credit.connect.name}(${getMonth(addMonths(date, 1)) + 1}월)`
              : `${credit.connect.name}(${getMonth(addMonths(date, 2)) + 1}월)`;

          return this.prisma.transaction.create({
            data: {
              debit: {
                connect: {
                  name: debit.connect.name,
                },
              },
              credit: {
                connectOrCreate: {
                  where: {
                    name: creditAccountName,
                  },
                  create: {
                    name: creditAccountName,
                    parentAccount: {
                      connect: {
                        name: credit.connect.name,
                      },
                    },
                    side: 'CREDIT',
                  },
                },
              },
              amount,
              date,
            },
          });
        });

      const transactionIds = transactions.map(
        (transaction, index) => lastTransactionId + index + 1,
      );

      const createPeriodicTransactionRecord =
        this.prisma.periodicTransactionRecord.createMany({
          data: transactionIds.map((transactionId) => ({
            transactionId,
            periodicTransactionId: nextPeriodicTransactionId,
          })),
        });

      return this.prisma.$transaction([
        createPeriodicTransaction,
        ...transactions,
        createPeriodicTransactionRecord,
      ]);
    }

    let date = startDate;

    const dates = [];

    while (!isAfter(date, endDate)) {
      dates.push(date);
      switch (interval) {
        case 'DAILY':
          date = addDays(date, 1);
          break;
        case 'WEEKLY':
          date = addWeeks(date, 1);
        case 'MONTHLY':
          date = addMonths(date, 1);
          break;
        case 'YEARLY':
          date = addYears(date, 1);
          break;
      }
    }

    const today = getKoreanTime(new Date());

    const transactions = dates
      .filter((date) => !isBefore(date, today))
      .map((date) => {
        return this.prisma.transaction.create({
          data: {
            debit: {
              connect: {
                name: debit.connect.name,
              },
            },
            credit: {
              connect: {
                name: credit.connect.name,
              },
            },
            amount,
            date,
          },
        });
      });

    const transactionIds = transactions.map(
      (transaction, index) => lastTransactionId + index + 1,
    );

    const createPeriodicTransactionRecord =
      this.prisma.periodicTransactionRecord.createMany({
        data: transactionIds.map((transactionId) => ({
          transactionId,
          periodicTransactionId: nextPeriodicTransactionId,
        })),
      });

    return this.prisma.$transaction([
      createPeriodicTransaction,
      ...transactions,
      createPeriodicTransactionRecord,
    ]);
  }

  async updatePeriodicTransaction({
    id,
    data,
  }: {
    id: number;
    data: Prisma.PeriodicTransactionUpdateInput;
  }) {
    return this.prisma.periodicTransaction.update({
      where: {
        id,
      },
      data,
    });
  }

  async deletePeriodicTransaction({ id }: { id: number }) {
    return this.prisma.periodicTransaction.delete({
      where: {
        id,
      },
    });
  }
}
