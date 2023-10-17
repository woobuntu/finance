import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDTO } from '@prisma-custom-types';
import { isNull, isUndefined } from 'lodash';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  getAccounts({ startDate, endDate }: { startDate: Date; endDate: Date }) {
    return this.prisma.account.findMany({
      where: {
        parentAccountName: null,
      },
      include: {
        debitRelatedTransactions: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        creditRelatedTransactions: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        childAccounts: {
          include: {
            debitRelatedTransactions: {
              where: {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
            creditRelatedTransactions: {
              where: {
                date: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
            childAccounts: {
              include: {
                debitRelatedTransactions: {
                  where: {
                    date: {
                      gte: startDate,
                      lte: endDate,
                    },
                  },
                },
                creditRelatedTransactions: {
                  where: {
                    date: {
                      gte: startDate,
                      lte: endDate,
                    },
                  },
                },
                childAccounts: {
                  include: {
                    debitRelatedTransactions: {
                      where: {
                        date: {
                          gte: startDate,
                          lte: endDate,
                        },
                      },
                    },
                    creditRelatedTransactions: {
                      where: {
                        date: {
                          gte: startDate,
                          lte: endDate,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getAccountOptions() {
    const accountOptions = await this.prisma.account.findMany({
      select: {
        name: true,
        side: true,
        parentAccountName: true,
      },
    });

    const mappedAccountOptions = await Promise.all(
      accountOptions.map(async (account) => {
        const { name, parentAccountName, side } = account;

        const rootParentAccountName = isNull(parentAccountName)
          ? name
          : await this.getRootParentAccountName(name);

        return {
          name,
          side,
          rootParentAccountName,
        };
      }),
    );

    mappedAccountOptions.sort((a, b) => {
      if (a.rootParentAccountName < b.rootParentAccountName) return -1;
      if (a.rootParentAccountName > b.rootParentAccountName) return 1;
      return 0;
    });

    return mappedAccountOptions;
  }

  async haveParentAccount({
    accountName,
    parentAccountName,
  }: {
    accountName: string;
    parentAccountName: string;
  }): Promise<boolean> {
    const account = await this.prisma.account.findUnique({
      where: {
        name: accountName,
      },
      select: {
        parentAccountName: true,
      },
    });

    if (isUndefined(account)) return false;

    if (account.parentAccountName === parentAccountName) return true;

    if (isNull(account.parentAccountName)) return false;

    return this.haveParentAccount({
      accountName: account.parentAccountName,
      parentAccountName,
    });
  }

  async getRootParentAccountName(accountName: string): Promise<string> {
    const account = await this.prisma.account.findUniqueOrThrow({
      where: {
        name: accountName,
      },
      select: {
        parentAccountName: true,
      },
    });

    const parentAccount = await this.prisma.account.findUnique({
      where: {
        name: account.parentAccountName,
      },
    });

    if (!parentAccount.parentAccountName) {
      return parentAccount.name;
    }

    return this.getRootParentAccountName(parentAccount.name);
  }

  async createAccount(data: CreateAccountDTO) {
    const account = await this.prisma.account.findUnique({
      where: {
        name: data.name,
      },
    });

    if (account) throw new BadRequestException('이미 존재하는 계정입니다.');

    return this.prisma.account.create({
      data,
    });
  }

  removeAccount(name: string) {
    return this.prisma.account.delete({
      where: {
        name,
      },
    });
  }
}
