import { Injectable } from '@nestjs/common';
import { DummyType } from '@prisma-custom-types';

@Injectable()
export class AppService {
  getHello(): DummyType {
    return 'Hello World!';
  }
}
