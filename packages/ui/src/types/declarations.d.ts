// 覆盖 @radix-ui/react-popover 的类型定义
declare module '@radix-ui/react-popover' {
  import * as React from 'react';

  // Root
  type PopoverProps = {
    children?: React.ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  };
  
  const Root: React.FC<PopoverProps>;

  // Trigger
  type PopoverTriggerProps = React.ComponentPropsWithoutRef<'button'> & {
    asChild?: boolean;
  };
  
  const Trigger: React.ForwardRefExoticComponent<
    PopoverTriggerProps & React.RefAttributes<HTMLButtonElement>
  >;

  // Content
  type PopoverContentProps = React.ComponentPropsWithoutRef<'div'> & {
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    alignOffset?: number;
    avoidCollisions?: boolean;
    collisionBoundary?: Element | null | Array<Element | null>;
    collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
    arrowPadding?: number;
    sticky?: 'partial' | 'always';
    hideWhenDetached?: boolean;
    updatePositionStrategy?: 'optimized' | 'always';
    onEscapeKeyDown?: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: PointerDownOutsideEvent) => void;
    onFocusOutside?: (event: FocusOutsideEvent) => void;
    onInteractOutside?: (event: InteractOutsideEvent) => void;
  };
  
  const Content: React.ForwardRefExoticComponent<
    PopoverContentProps & React.RefAttributes<HTMLDivElement>
  >;

  // Portal
  type PopoverPortalProps = {
    children: React.ReactNode;
    container?: HTMLElement | null;
    forceMount?: boolean;
  };
  
  const Portal: React.FC<PopoverPortalProps>;

  // 事件类型
  type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;
  type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>;
  type InteractOutsideEvent = PointerDownOutsideEvent | FocusOutsideEvent;

  export {
    Root,
    Trigger,
    Portal,
    Content,
    PopoverProps,
    PopoverTriggerProps,
    PopoverContentProps,
    PopoverPortalProps
  };
}
