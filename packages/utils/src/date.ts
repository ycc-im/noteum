import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 加载插件
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 获取当前的 UTC 时间戳（毫秒）
 * @returns 时间戳
 */
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

/**
 * 格式化日期（默认使用用户时区）
 * @param date 日期
 * @param format 格式
 * @param tz 时区（可选，默认使用用户本地时区）
 */
export const formatDate = (date: Date | string | number, format = 'YYYY-MM-DD', tz?: string): string => {
  const d = dayjs(date);
  return tz ? d.tz(tz).format(format) : d.format(format);
};

/**
 * 转换时间为时间戳（毫秒）
 * @param date 日期
 * @returns 时间戳
 */
export const toTimestamp = (date: Date | string | number): number => {
  return dayjs(date).valueOf();
};

/**
 * 从时间戳转换为指定时区的时间字符串
 * @param timestamp 时间戳（毫秒）
 * @param tz 目标时区
 * @param format 输出格式
 */
export const fromTimestamp = (timestamp: number, tz: string, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(timestamp).tz(tz).format(format);
};

/**
 * 转换时间为 UTC 格式（向后兼容）
 * @param date 日期
 * @returns UTC 格式的时间字符串
 * @deprecated 推荐使用 toTimestamp
 */
export const toUTC = (date: Date | string | number): string => {
  return dayjs(date).utc().format();
};

/**
 * 从 UTC 转换为指定时区的时间（向后兼容）
 * @param date UTC 时间
 * @param tz 目标时区
 * @param format 输出格式
 * @deprecated 推荐使用 fromTimestamp
 */
export const fromUTC = (date: string, tz: string, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs.utc(date).tz(tz).format(format);
};

/**
 * 计算两个日期之间的天数
 * @param start 开始日期
 * @param end 结束日期
 */
export const daysBetween = (start: Date | string | number, end: Date | string | number): number => {
  return dayjs(end).diff(dayjs(start), 'day');
};

/**
 * 判断时间戳是否有效
 * @param timestamp 时间戳
 */
export const isValidTimestamp = (timestamp: number): boolean => {
  return !isNaN(timestamp) && timestamp > 0 && timestamp < 8640000000000000;
};
