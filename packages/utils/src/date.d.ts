/**
 * 获取当前的 UTC 时间戳（毫秒）
 * @returns 时间戳
 */
export declare const getCurrentTimestamp: () => number;
/**
 * 格式化日期（默认使用用户时区）
 * @param date 日期
 
 * @param tz 时区（可选，默认使用用户本地时区）
 */
export declare const formatDate: (date: Date | string | number, format?: string, tz?: string) => string;
/**
 * 转换时间为时间戳（毫秒）
 * @param date 日期
 * @returns 时间戳
 */
export declare const toTimestamp: (date: Date | string | number) => number;
/**
 * 从时间戳转换为指定时区的时间字符串
 * @param timestamp 时间戳（毫秒）
 * @param tz 目标时区
 * @param format 输出格式
 */
export declare const fromTimestamp: (timestamp: number, tz: string, format?: string) => string;
/**
 * 转换时间为 UTC 格式（向后兼容）
 * @param date 日期
 * @returns UTC 格式的时间字符串
 * @deprecated 推荐使用 toTimestamp
 */
export declare const toUTC: (date: Date | string | number) => string;
/**
 * 从 UTC 转换为指定时区的时间（向后兼容）
 * @param date UTC 时间
 * @param tz 目标时区
 * @param format 输出格式
 * @deprecated 推荐使用 fromTimestamp
 */
export declare const fromUTC: (date: string, tz: string, format?: string) => string;
/**
 * 计算两个日期之间的天数
 * @param start 开始日期
 * @param end 结束日期
 */
export declare const daysBetween: (start: Date | string | number, end: Date | string | number) => number;
/**
 * 判断时间戳是否有效
 * @param timestamp 时间戳
 */
export declare const isValidTimestamp: (timestamp: number) => boolean;
//# sourceMappingURL=date.d.ts.map