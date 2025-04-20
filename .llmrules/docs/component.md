# UI 组件开发规范

## 组件设计原则

1. 单一职责原则
2. 组件可复用性
3. 可维护性
4. 可测试性
5. 可访问性

## 组件目录结构

```
components/
├── Button/
│   ├── Button.tsx        # 主组件
│   ├── Button.test.tsx   # 测试文件
│   ├── Button.types.ts   # 类型定义
│   ├── Button.css        # 样式文件
│   └── index.ts         # 导出文件
└── Card/
    ├── Card.tsx
    ├── Card.test.tsx
    ├── Card.types.ts
    ├── Card.css
    └── index.ts
```

## 组件命名规范

### 文件命名

```typescript
// ✅ 推荐
Button.tsx
UserProfile.tsx
NavigationBar.tsx

// ❌ 避免
button.tsx
userProfile.tsx
navigation-bar.tsx
```

### 组件命名

```typescript
// ✅ 推荐
export const Button: React.FC<ButtonProps> = () => {};
export const UserProfile: React.FC<UserProfileProps> = () => {};

// ❌ 避免
export const button = () => {};
export const userProfile = () => {};
```

## 组件属性定义

### 类型定义

```typescript
interface ButtonProps {
  /** 按钮内容 */
  children: React.ReactNode;
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'text';
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large';
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击处理函数 */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### 默认属性

```typescript
const defaultProps = {
  variant: 'primary' as const,
  size: 'medium' as const,
  disabled: false
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = defaultProps.variant,
  size = defaultProps.size,
  disabled = defaultProps.disabled,
  onClick
}) => {
  // 实现
};
```

## 组件实现规范

### 基本结构

```typescript
import React from 'react';
import type { ButtonProps } from './Button.types';
import './Button.css';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <button
      className={`button ${variant} ${size}`}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
```

### 样式管理

```typescript
// 使用 CSS Modules
import styles from './Button.module.css';

// 使用 Tailwind CSS
<button 
  className={cn(
    'px-4 py-2 rounded-md',
    'bg-blue-500 hover:bg-blue-600',
    'text-white font-medium',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
  {children}
</button>
```

## 状态管理

### 本地状态

```typescript
const [isOpen, setIsOpen] = useState(false);
const toggleOpen = useCallback(() => {
  setIsOpen(prev => !prev);
}, []);
```

### 复杂状态

```typescript
interface State {
  isOpen: boolean;
  activeTab: string;
  items: string[];
}

type Action =
  | { type: 'TOGGLE_OPEN' }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'ADD_ITEM'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'TOGGLE_OPEN':
      return { ...state, isOpen: !state.isOpen };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    default:
      return state;
  }
};
```

## 可访问性规范

### ARIA 属性使用

```typescript
// 按钮示例
<button
  aria-label="关闭对话框"
  aria-pressed={isPressed}
  disabled={disabled}
>
  <Icon name="close" />
</button>

// 对话框示例
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">标题</h2>
  <p id="dialog-description">描述内容</p>
</div>
```

### 键盘导航

```typescript
const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case 'Space':
      onSelect();
      break;
    case 'Escape':
      onClose();
      break;
  }
};
```

## 性能优化

### 组件优化

```typescript
// 使用 memo
export const MemoizedComponent = React.memo(
  ({ value }: Props) => <div>{value}</div>,
  (prevProps, nextProps) => prevProps.value === nextProps.value
);

// 使用 useCallback
const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependency]);

// 使用 useMemo
const computedValue = useMemo(() => {
  return expensiveComputation(props.value);
}, [props.value]);
```

### 条件渲染优化

```typescript
// ✅ 推荐
const [isVisible, setIsVisible] = useState(false);

return (
  <div>
    {isVisible && <ExpensiveComponent />}
  </div>
);

// ❌ 避免
return (
  <div>
    <ExpensiveComponent style={{ display: isVisible ? 'block' : 'none' }} />
  </div>
);
```

## 组件测试

### 单元测试

```typescript
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render correctly', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click me</Button>
    );
    fireEvent.click(getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 快照测试

```typescript
it('should match snapshot', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container).toMatchSnapshot();
});
```

## 文档规范

### 组件文档

```typescript
/**
 * 按钮组件
 * @component Button
 * @example
 * ```tsx
 * <Button variant="primary" size="medium">
 *   点击我
 * </Button>
 * ```
 */
export const Button: React.FC<ButtonProps> = // ...
```

### Storybook 配置

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'text']
    }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按钮'
  }
};
```

## 最佳实践

1. 组件设计
   - 保持组件职责单一
   - 提取可复用逻辑到 hooks
   - 使用适当的属性类型
   - 提供合理的默认值

2. 性能考虑
   - 适当使用 memo
   - 优化重渲染
   - 延迟加载大型组件
   - 优化事件处理器

3. 可访问性
   - 提供键盘支持
   - 使用语义化标签
   - 添加适当的 ARIA 属性
   - 确保足够的颜色对比度

4. 测试覆盖
   - 编写单元测试
   - 添加集成测试
   - 维护快照测试
   - 测试边界情况

5. 文档完整性
   - 添加组件说明
   - 提供使用示例
   - 说明属性用途
   - 记录特殊行为