import { Injectable, PipeTransform } from '@nestjs/common';
import { getKoreanTime } from 'src/utils/getKoreanTime';

@Injectable()
export class ParseDateStringPipe implements PipeTransform<string, Date> {
  transform(value: string): Date {
    return getKoreanTime(new Date(value));
  }
}
