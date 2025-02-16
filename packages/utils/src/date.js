"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidTimestamp = exports.daysBetween = exports.fromUTC = exports.toUTC = exports.fromTimestamp = exports.toTimestamp = exports.formatDate = exports.getCurrentTimestamp = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
// 加载插件
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
/**
 * 获取当前的 UTC 时间戳（毫秒）
 * @returns 时间戳
 */
const getCurrentTimestamp = () => {
    return Date.now();
};
exports.getCurrentTimestamp = getCurrentTimestamp;
/**
 * 格式化日期（默认使用用户时区）
 * @param date 日期
 
 * @param tz 时区（可选，默认使用用户本地时区）
 */
const formatDate = (date, format = 'YYYY-MM-DD', tz) => {
    const d = (0, dayjs_1.default)(date);
    return tz ? d.tz(tz).format(format) : d.format(format);
};
exports.formatDate = formatDate;
/**
 * 转换时间为时间戳（毫秒）
 * @param date 日期
 * @returns 时间戳
 */
const toTimestamp = (date) => {
    return (0, dayjs_1.default)(date).valueOf();
};
exports.toTimestamp = toTimestamp;
/**
 * 从时间戳转换为指定时区的时间字符串
 * @param timestamp 时间戳（毫秒）
 * @param tz 目标时区
 * @param format 输出格式
 */
const fromTimestamp = (timestamp, tz, format = 'YYYY-MM-DD HH:mm:ss') => {
    return (0, dayjs_1.default)(timestamp).tz(tz).format(format);
};
exports.fromTimestamp = fromTimestamp;
/**
 * 转换时间为 UTC 格式（向后兼容）
 * @param date 日期
 * @returns UTC 格式的时间字符串
 * @deprecated 推荐使用 toTimestamp
 */
const toUTC = (date) => {
    return (0, dayjs_1.default)(date).utc().format();
};
exports.toUTC = toUTC;
/**
 * 从 UTC 转换为指定时区的时间（向后兼容）
 * @param date UTC 时间
 * @param tz 目标时区
 * @param format 输出格式
 * @deprecated 推荐使用 fromTimestamp
 */
const fromUTC = (date, tz, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs_1.default.utc(date).tz(tz).format(format);
};
exports.fromUTC = fromUTC;
/**
 * 计算两个日期之间的天数
 * @param start 开始日期
 * @param end 结束日期
 */
const daysBetween = (start, end) => {
    return (0, dayjs_1.default)(end).diff((0, dayjs_1.default)(start), 'day');
};
exports.daysBetween = daysBetween;
/**
 * 判断时间戳是否有效
 * @param timestamp 时间戳
 */
const isValidTimestamp = (timestamp) => {
    return !isNaN(timestamp) && timestamp > 0 && timestamp < 8640000000000000;
};
exports.isValidTimestamp = isValidTimestamp;
//# sourceMappingURL=date.js.map