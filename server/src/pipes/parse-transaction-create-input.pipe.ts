import { PipeTransform } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export class ParseTransactionCreateInputPipe
  implements
    PipeTransform<Prisma.TransactionCreateInput, Prisma.TransactionCreateInput>
{
  transform(
    value: Prisma.TransactionCreateInput,
  ): Prisma.TransactionCreateInput {
    return {
      ...value,
      date: new Date(value.date.toString().replace(/\+/, ' ')),
    };
  }
}
