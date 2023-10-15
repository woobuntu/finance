import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Patch,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Prisma } from '@prisma/client';
import { ParseDateStringPipe } from 'src/pipes/parse-date-string.pipe';
import { ParseTransactionCreateInputPipe } from 'src/pipes/parse-transaction-create-input.pipe';
import { ParsePeriodicTransactionCreateInputPipe } from 'src/pipes/parse-periodic-transaction-create-input.pipe';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async getTransactions(
    @Query('startDate', new ParseDateStringPipe()) startDate: Date,
    @Query('endDate', new ParseDateStringPipe()) endDate: Date,
    @Query('accountName') accountName?: string,
  ) {
    return this.transactionService.getTransactions({
      startDate,
      endDate,
      accountName,
    });
  }

  @Get('periodic')
  async getPeriodicTransactions() {
    return this.transactionService.getPeriodicTransactions();
  }

  @Post()
  async createTransaction(
    @Body(new ParseTransactionCreateInputPipe())
    transaction: Prisma.TransactionCreateInput,
  ) {
    return this.transactionService.createTransaction(transaction);
  }

  @Post('periodic')
  async createPeriodicTransaction(
    @Body(new ParsePeriodicTransactionCreateInputPipe())
    transaction: Prisma.PeriodicTransactionCreateInput,
  ) {
    return this.transactionService.createPeriodicTransaction(transaction);
  }

  @Patch('periodic')
  async updatePeriodicTransaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Prisma.PeriodicTransactionUpdateInput,
  ) {
    return this.transactionService.updatePeriodicTransaction({
      id,
      data,
    });
  }

  @Delete('periodic')
  async deletePeriodicTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.deletePeriodicTransaction({ id });
  }
}
