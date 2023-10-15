import { PipeTransform } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getKoreanTime } from 'src/utils/getKoreanTime';

export class ParsePeriodicTransactionCreateInputPipe
  implements
    PipeTransform<
      Prisma.PeriodicTransactionCreateInput,
      Prisma.PeriodicTransactionCreateInput
    >
{
  transform(
    value: Prisma.PeriodicTransactionCreateInput,
  ): Prisma.PeriodicTransactionCreateInput {
    return {
      ...value,
      startDate: getKoreanTime(new Date(value.startDate)),
      endDate: getKoreanTime(new Date(value.endDate)),
    };
  }
}
