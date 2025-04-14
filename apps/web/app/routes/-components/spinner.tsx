import * as React from 'react'

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'accent'
}

export function Spinner({ size = 'medium', color = 'primary' }: SpinnerProps) {
  // 根据尺寸设置不同的大小
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28',
  }

  // 根据颜色设置不同的样式
  const colorValues = {
    primary: '#3b82f6', // blue-500
    secondary: '#8b5cf6', // purple-500
    accent: '#f59e0b', // amber-500
  }

  const selectedColor = colorValues[color]

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={sizeClasses[size]}>
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          role="img"
          aria-label="加载动画"
        >
          <title>加载动画</title>
          {/* 笔记本轮廓 */}
          <rect
            x="20"
            y="20"
            width="60"
            height="70"
            rx="2"
            fill="none"
            stroke={selectedColor}
            strokeWidth="2"
            className="animate-pulse"
            style={{ animationDuration: '2s' }}
          />

          {/* 笔记本线条 - 动画效果 */}
          {[0, 1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <line
                x1="30"
                y1={35 + i * 10}
                x2="70"
                y2={35 + i * 10}
                stroke={selectedColor}
                strokeWidth="2"
                strokeDasharray="40"
                strokeDashoffset="40"
                className="origin-left"
                style={{
                  animation: `typewriter 1s ease-in-out ${i * 0.15}s infinite alternate`,
                }}
              />
            </React.Fragment>
          ))}

          {/* 笔动画 */}
          <g
            className="origin-bottom-right"
            style={{
              animation: 'writingPen 1s ease-in-out infinite',
              transformBox: 'fill-box',
              transformOrigin: 'bottom right',
            }}
          >
            <path d="M75,30 L85,20 L80,15 L70,25 Z" fill={selectedColor} />
            <line x1="70" y1="25" x2="75" y2="30" stroke={selectedColor} strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* 加载文字 */}
      <div className="mt-4 text-sm font-medium tracking-wider" style={{ color: selectedColor }}>
        LOADING NOTEUM...
      </div>

      {/* 动画定义 */}
      <style>{`
        @keyframes typewriter {
          0% { stroke-dashoffset: 40; }
          40% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        
        @keyframes writingPen {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-15deg); }
        }
      `}</style>
    </div>
  )
}
