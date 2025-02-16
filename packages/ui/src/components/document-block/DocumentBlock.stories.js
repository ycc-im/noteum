import { jsx as _jsx } from "react/jsx-runtime";
import { DocumentBlock } from "./DocumentBlock";
import { mockBlocks } from "../../../.storybook/mocks/blocks.mock";
import { useState } from "react";
const meta = {
    title: "Components/DocumentBlock",
    component: DocumentBlock,
    tags: ["autodocs"],
};
export default meta;
// 单个块的展示
export const SingleBlock = {
    args: {
        block: mockBlocks[0],
    },
};
// 展示所有类型的块
export const AllBlocks = () => {
    const [blocks, setBlocks] = useState(mockBlocks);
    const handleIndentChange = (id, newIndent) => {
        setBlocks(blocks.map(block => block.id === id ? { ...block, indent: newIndent } : block));
    };
    return (_jsx("div", { className: "space-y-1", children: blocks.map(block => (_jsx(DocumentBlock, { block: block, onIndentChange: handleIndentChange }, block.id))) }));
};
//# sourceMappingURL=DocumentBlock.stories.js.map