export interface Block {
    id: string;
    type: 'paragraph' | 'heading' | 'list-item' | 'code' | 'quote';
    content: string;
    indent: number;
    prevId?: string;
    nextId?: string;
}
//# sourceMappingURL=document.d.ts.map