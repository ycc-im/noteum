import dayjs from 'dayjs';

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 */
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

/**
 * 计算两个日期之间的天数
 * @param start 开始日期
 * @param end 结束日期
 */
export const daysBetween = (start: Date | string, end: Date | string): number => {
  return dayjs(end).diff(dayjs(start), 'day');
};
