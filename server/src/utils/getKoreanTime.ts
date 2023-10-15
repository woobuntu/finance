import { formatInTimeZone } from 'date-fns-tz';

export const getKoreanTime = (date: Date) => {
  const kstTimeZone = 'Asia/Seoul';

  const formattedDate = formatInTimeZone(
    date,
    kstTimeZone,
    'yyyy-MM-dd HH:mm:ss zzz',
  );

  return new Date(formattedDate.substring(0, 10) + 'T00:00:00.000Z');
};
