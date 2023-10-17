import { Injectable } from '@nestjs/common';
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
  isAfter,
  isBefore,
  startOfTomorrow,
} from 'date-fns';
import { isEqual, isString, isUndefined } from 'lodash';
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
      : isBefore(endDate, endOfToday())
      ? {
          date: endDate,
        }
      : {
          date: {
            gte: new Date(startOfTomorrow().toString().replace(/\+/, ' ')),
            lte: endOfDay(endDate),
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
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async createTransaction(transaction: Prisma.TransactionCreateInput) {
    return this.prisma.transaction.create({
      data: transaction,
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
