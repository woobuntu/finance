import {
  Catch,
  ArgumentsHost,
  LoggerService,
  HttpServer,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class LogErrorFilter extends BaseExceptionFilter {
  constructor(
    private readonly httpAdapter: HttpServer,
    private readonly logger: LoggerService,
  ) {
    super(httpAdapter);
  }

  catch(exception: any, host: ArgumentsHost) {
    try {
      const regex = /at\s(\w+)\./;
      const match = exception?.stack.match(regex);

      let contextString = '';

      if (match && match.length >= 2) {
        contextString = match[1];
      }

      this.logger.error({
        message: exception?.message,
        context: contextString,
        stack: exception?.stack,
      });
    } catch (loggerError) {
      this.logger.error('Failed to log error', loggerError);
    }
    super.catch(exception, host);
  }
}
