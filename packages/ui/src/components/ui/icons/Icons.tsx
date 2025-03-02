import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  type LucideIcon,
  type LucideProps
} from "lucide-react"

// 确保图标可以作为 JSX 组件使用
type IconComponent = React.FC<React.ComponentProps<"svg"> & { size?: number }>

// 创建包装组件以确保类型兼容性
const createIconComponent = (Icon: LucideIcon): IconComponent => {
  const Component: IconComponent = (props) => <Icon {...props} />
  Component.displayName = Icon.displayName || Icon.name
  return Component
}

export const Icons = {
  ChevronLeft: createIconComponent(ChevronLeft),
  ChevronRight: createIconComponent(ChevronRight),
  Calendar: createIconComponent(Calendar),
}
