import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [AccountModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
