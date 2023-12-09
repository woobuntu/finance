import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDTO } from '@prisma-custom-types';
import { ParseDateStringPipe } from 'src/pipes/parse-date-string.pipe';
import { Prisma } from '@prisma/client';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAccounts(
    @Query('rootAccountName') rootAccountName: string | undefined,
    @Query('startDate', new ParseDateStringPipe()) startDate: Date | undefined,
    @Query('endDate', new ParseDateStringPipe()) endDate: Date,
  ) {
    return this.accountService.getAccounts({
      rootAccountName: rootAccountName ?? null,
      startDate,
      endDate,
    });
  }

  @Get('options')
  getAccountOptions() {
    return this.accountService.getAccountOptions();
  }

  @Post()
  createAccount(@Body() data: CreateAccountDTO) {
    return this.accountService.createAccount(data);
  }

  @Patch(':name')
  updateAccount(
    @Param('name') name: string,
    @Body() data: Prisma.AccountUpdateInput,
  ) {
    return this.accountService.updateAccount({
      name,
      data,
    });
  }

  @Delete(':name')
  removeAccount(@Param('name') name: string) {
    return this.accountService.removeAccount(name);
  }
}
