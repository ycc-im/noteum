import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  type LucideIcon,
  type LucideProps
} from "lucide-react"

// 定义图标组件类型
type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

// 创建包装组件以确保类型兼容性
const createIconComponent = (Icon: LucideIcon): React.FC<IconProps> => {
  // 使用类型断言来解决类型问题
  const Component: React.FC<IconProps> = (props) => {
    const IconComponent = Icon as unknown as React.FC<IconProps>
    return <IconComponent {...props} />
  }
  Component.displayName = Icon.displayName || Icon.name
  return Component
}

export const Icons = {
  ChevronLeft: createIconComponent(ChevronLeft),
  ChevronRight: createIconComponent(ChevronRight),
  ChevronDown: createIconComponent(ChevronDown),
  Calendar: createIconComponent(Calendar),
}
