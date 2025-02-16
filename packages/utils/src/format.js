"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAmount = exports.formatFileSize = void 0;
/**
 * 格式化文件大小
 * @param bytes 字节数
 */
const formatFileSize = (bytes) => {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};
exports.formatFileSize = formatFileSize;
/**
 * 格式化金额（添加千分位）
 * @param amount 金额
 */
const formatAmount = (amount) => {
    return amount.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
exports.formatAmount = formatAmount;
//# sourceMappingURL=format.js.map