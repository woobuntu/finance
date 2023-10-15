import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDTO } from '@prisma-custom-types';
import { ParseDateStringPipe } from 'src/pipes/parse-date-string.pipe';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAccounts(
    @Query('startDate', new ParseDateStringPipe()) startDate: Date | undefined,
    @Query('endDate', new ParseDateStringPipe()) endDate: Date,
  ) {
    return this.accountService.getAccounts({
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

  @Delete(':name')
  removeAccount(@Param('name') name: string) {
    return this.accountService.removeAccount(name);
  }
}
