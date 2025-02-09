import * as React from "react"
import { cn } from "@/lib/utils"
import { Block } from "../../../.storybook/mocks/blocks.mock"
import { ChevronRightIcon, ChevronDownIcon } from "@radix-ui/react-icons"

interface DocumentBlockProps {
    block: Block
    className?: string
    onIndentChange?: (id: string, indent: number) => void
}

export function DocumentBlock({
    block,
    className,
    onIndentChange
}: DocumentBlockProps) {
    const handleIndentIncrease = () => {
        onIndentChange?.(block.id, block.indent + 1)
    }

    const handleIndentDecrease = () => {
        if (block.indent > 0) {
            onIndentChange?.(block.id, block.indent - 1)
        }
    }

    const renderBlockContent = () => {
        switch (block.type) {
            case 'heading':
                return <h2 className="text-2xl font-bold">{block.content}</h2>
            case 'paragraph':
                return <p className="text-base">{block.content}</p>
            case 'list-item':
                return (
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-current mr-2" />
                        {block.content}
                    </div>
                )
            case 'code':
                return (
                    <pre className="bg-muted p-2 rounded">
                        <code>{block.content}</code>
                    </pre>
                )
            case 'quote':
                return (
                    <blockquote className="border-l-4 border-primary pl-4">
                        {block.content}
                    </blockquote>
                )
            default:
                return block.content
        }
    }

    return (
        <div
            className={cn(
                "group relative flex items-start p-2 hover:bg-muted/50 rounded-md transition-colors",
                className
            )}
            style={{ marginLeft: `${block.indent * 24}px` }}
        >
            {/* 缩进控制 */}
            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1 px-2">
                <button
                    onClick={handleIndentDecrease}
                    className="p-1 hover:bg-muted rounded disabled:opacity-50"
                    disabled={block.indent === 0}
                >
                    <ChevronRightIcon />
                </button>
                <button
                    onClick={handleIndentIncrease}
                    className="p-1 hover:bg-muted rounded"
                >
                    <ChevronDownIcon />
                </button>
            </div>

            {/* 内容区域 */}
            <div className="flex-1">
                {renderBlockContent()}
            </div>
        </div>
    )
}
