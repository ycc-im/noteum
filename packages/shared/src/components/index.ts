// 共享 UI 组件库的主导出文件
// 导出所有组件的类型定义和工厂函数

// Button 组件
export type { ButtonProps } from './Button';
export {
  getButtonClasses,
  getButtonAttributes,
  createButtonConfig
} from './Button';

// Input 组件  
export type { InputProps } from './Input';
export {
  getInputClasses,
  getLabelClasses,
  getErrorMessageClasses,
  getHelperTextClasses,
  getInputAttributes,
  createInputConfig
} from './Input';

// 组件库版本信息
export const COMPONENTS_VERSION = '1.0.0';

// 组件库配置
export interface ComponentsConfig {
  /**
   * 全局主题配置
   */
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    borderRadius?: string;
    fontFamily?: string;
  };
  /**
   * 全局类名前缀
   */
  classPrefix?: string;
}