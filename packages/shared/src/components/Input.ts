// Input 组件的基本类型定义和工厂函数
// 这个组件设计为框架无关，可以被 React, Vue 等不同框架使用

export interface InputProps {
  /**
   * 输入框类型
   */
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search";
  /**
   * 输入框占位符文本
   */
  placeholder?: string;
  /**
   * 输入框值
   */
  value?: string;
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 输入框大小
   */
  size?: "small" | "medium" | "large";
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否只读
   */
  readonly?: boolean;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 输入框名称
   */
  name?: string;
  /**
   * 输入框 ID
   */
  id?: string;
  /**
   * 最大长度
   */
  maxLength?: number;
  /**
   * 最小长度
   */
  minLength?: number;
  /**
   * 输入变化事件处理函数
   */
  onChange?: (value: string) => void;
  /**
   * 获得焦点事件处理函数
   */
  onFocus?: () => void;
  /**
   * 失去焦点事件处理函数
   */
  onBlur?: () => void;
  /**
   * 按键事件处理函数
   */
  onKeyDown?: (key: string) => void;
  /**
   * 自定义 CSS 类名
   */
  className?: string;
  /**
   * 错误状态
   */
  error?: boolean;
  /**
   * 错误信息
   */
  errorMessage?: string;
  /**
   * 标签文本
   */
  label?: string;
  /**
   * 帮助文本
   */
  helperText?: string;
}

/**
 * 获取输入框的基础 CSS 类名
 */
export function getInputClasses(props: InputProps): string {
  const baseClasses = [
    "w-full",
    "rounded-md",
    "border",
    "bg-white",
    "text-gray-900",
    "placeholder-gray-500",
    "transition-colors",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-offset-2",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
    "read-only:bg-gray-50",
  ];

  // 根据错误状态添加样式
  if (props.error) {
    baseClasses.push(
      "border-red-300",
      "focus:border-red-500",
      "focus:ring-red-500",
    );
  } else {
    baseClasses.push(
      "border-gray-300",
      "focus:border-blue-500",
      "focus:ring-blue-500",
    );
  }

  // 根据大小添加样式
  switch (props.size) {
    case "small":
      baseClasses.push("px-2.5", "py-1.5", "text-sm");
      break;
    case "large":
      baseClasses.push("px-4", "py-3", "text-lg");
      break;
    default:
      baseClasses.push("px-3", "py-2", "text-base");
  }

  // 添加自定义类名
  if (props.className) {
    baseClasses.push(props.className);
  }

  return baseClasses.join(" ");
}

/**
 * 获取标签的 CSS 类名
 */
export function getLabelClasses(props: InputProps): string {
  const baseClasses = [
    "block",
    "text-sm",
    "font-medium",
    "text-gray-700",
    "mb-1",
  ];

  if (props.error) {
    baseClasses.push("text-red-700");
  }

  return baseClasses.join(" ");
}

/**
 * 获取错误信息的 CSS 类名
 */
export function getErrorMessageClasses(): string {
  return ["mt-1", "text-sm", "text-red-600"].join(" ");
}

/**
 * 获取帮助文本的 CSS 类名
 */
export function getHelperTextClasses(): string {
  return ["mt-1", "text-sm", "text-gray-600"].join(" ");
}

/**
 * 获取输入框的基本属性对象
 */
export function getInputAttributes(props: InputProps): Record<string, any> {
  const attributes: Record<string, any> = {
    type: props.type || "text",
    placeholder: props.placeholder,
    value: props.value,
    defaultValue: props.defaultValue,
    disabled: props.disabled || false,
    readOnly: props.readonly || false,
    required: props.required || false,
    name: props.name,
    id: props.id,
    maxLength: props.maxLength,
    minLength: props.minLength,
    className: getInputClasses(props),
    onChange: props.onChange,
    onFocus: props.onFocus,
    onBlur: props.onBlur,
    onKeyDown: props.onKeyDown,
  };

  // 移除 undefined 值
  Object.keys(attributes).forEach((key) => {
    if (attributes[key] === undefined) {
      delete attributes[key];
    }
  });

  return attributes;
}

/**
 * 创建一个通用的输入框配置对象
 * 可以被不同框架的组件使用
 */
export function createInputConfig(props: InputProps) {
  return {
    props,
    inputClasses: getInputClasses(props),
    labelClasses: getLabelClasses(props),
    errorMessageClasses: getErrorMessageClasses(),
    helperTextClasses: getHelperTextClasses(),
    inputAttributes: getInputAttributes(props),
    hasLabel: Boolean(props.label),
    hasError: Boolean(props.error && props.errorMessage),
    hasHelperText: Boolean(props.helperText),
  };
}
