import { Block } from "@noteum/core";
interface DocumentBlockProps {
    block: Block;
    className?: string;
    onIndentChange?: (id: string, indent: number) => void;
}
export declare function DocumentBlock({ block, className, onIndentChange }: DocumentBlockProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=DocumentBlock.d.ts.map