"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = exports.capitalize = void 0;
/**
 * 首字母大写
 * @param str 输入字符串
 */
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalize = capitalize;
/**
 * 检查是否是有效的邮箱地址
 * @param email 邮箱地址
 */
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
exports.isValidEmail = isValidEmail;
//# sourceMappingURL=string.js.map