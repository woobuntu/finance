import { PipeTransform } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getKoreanTime } from 'src/utils/getKoreanTime';

export class ParseTransactionCreateInputPipe
  implements
    PipeTransform<Prisma.TransactionCreateInput, Prisma.TransactionCreateInput>
{
  transform(
    value: Prisma.TransactionCreateInput,
  ): Prisma.TransactionCreateInput {
    return {
      ...value,
      date: getKoreanTime(new Date(value.date)),
    };
  }
}
