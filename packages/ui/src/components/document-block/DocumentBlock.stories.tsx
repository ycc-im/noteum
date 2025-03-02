import type { Meta, StoryObj } from "@storybook/react"
import { DocumentBlock } from "./DocumentBlock"
import { mockBlocks } from "../../../.storybook/mocks/blocks.mock"
import { useState } from "react"

const meta: Meta<typeof DocumentBlock> = {
    title: "Components/DocumentBlock",
    component: DocumentBlock,
    tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof DocumentBlock>

// 单个块的展示
export const SingleBlock: Story = {
    args: {
        block: mockBlocks[0],
    },
}

// 展示所有类型的块
export const AllBlocks = () => {
    const [blocks, setBlocks] = useState(mockBlocks)

    const handleIndentChange = (id: string, newIndent: number) => {
        setBlocks(blocks.map(block => 
            block.id === id ? { ...block, indent: newIndent } : block
        ))
    }

    return (
        <div className="space-y-1">
            {blocks.map(block => (
                <DocumentBlock
                    key={block.id}
                    block={block}
                    onIndentChange={handleIndentChange}
                />
            ))}
        </div>
    )
}
