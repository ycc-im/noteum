// Button 组件的基本类型定义和工厂函数
// 这个组件设计为框架无关，可以被 React, Vue 等不同框架使用

export interface ButtonProps {
  /**
   * 按钮内容文本
   */
  label: string;
  /**
   * 按钮变体
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /**
   * 按钮大小
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 点击事件处理函数
   */
  onClick?: () => void;
  /**
   * 自定义 CSS 类名
   */
  className?: string;
  /**
   * 按钮类型
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * 获取按钮的基础 CSS 类名
 */
export function getButtonClasses(props: ButtonProps): string {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'rounded-md',
    'font-medium',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed'
  ];

  // 根据变体添加样式
  switch (props.variant) {
    case 'primary':
      baseClasses.push(
        'bg-blue-600',
        'text-white',
        'hover:bg-blue-700',
        'focus:ring-blue-500'
      );
      break;
    case 'secondary':
      baseClasses.push(
        'bg-gray-200',
        'text-gray-900',
        'hover:bg-gray-300',
        'focus:ring-gray-500'
      );
      break;
    case 'outline':
      baseClasses.push(
        'border',
        'border-gray-300',
        'bg-white',
        'text-gray-700',
        'hover:bg-gray-50',
        'focus:ring-blue-500'
      );
      break;
    case 'ghost':
      baseClasses.push(
        'bg-transparent',
        'text-gray-700',
        'hover:bg-gray-100',
        'focus:ring-gray-500'
      );
      break;
    default:
      baseClasses.push(
        'bg-blue-600',
        'text-white',
        'hover:bg-blue-700',
        'focus:ring-blue-500'
      );
  }

  // 根据大小添加样式
  switch (props.size) {
    case 'small':
      baseClasses.push('px-2.5', 'py-1.5', 'text-sm');
      break;
    case 'large':
      baseClasses.push('px-6', 'py-3', 'text-lg');
      break;
    default:
      baseClasses.push('px-4', 'py-2', 'text-base');
  }

  // 添加自定义类名
  if (props.className) {
    baseClasses.push(props.className);
  }

  return baseClasses.join(' ');
}

/**
 * 获取按钮的基本属性对象
 */
export function getButtonAttributes(props: ButtonProps): Record<string, any> {
  return {
    type: props.type || 'button',
    disabled: props.disabled || false,
    className: getButtonClasses(props),
    onClick: props.onClick
  };
}

/**
 * 创建一个通用的按钮配置对象
 * 可以被不同框架的组件使用
 */
export function createButtonConfig(props: ButtonProps) {
  return {
    props,
    classes: getButtonClasses(props),
    attributes: getButtonAttributes(props)
  };
}