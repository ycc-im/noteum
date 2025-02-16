export const mockBlocks = [
    {
        id: '1',
        type: 'heading',
        content: '文档标题',
        indent: 0,
        nextId: '2'
    },
    {
        id: '2',
        type: 'paragraph',
        content: '这是一个段落内容，演示基本的文本块。',
        indent: 0,
        prevId: '1',
        nextId: '3'
    },
    {
        id: '3',
        type: 'list-item',
        content: '这是一个列表项',
        indent: 1,
        prevId: '2',
        nextId: '4'
    },
    {
        id: '4',
        type: 'list-item',
        content: '这是一个缩进的列表项',
        indent: 2,
        prevId: '3',
        nextId: '5'
    },
    {
        id: '5',
        type: 'code',
        content: 'console.log("这是一段代码");',
        indent: 1,
        prevId: '4',
        nextId: '6'
    },
    {
        id: '6',
        type: 'quote',
        content: '这是一段引用文本',
        indent: 0,
        prevId: '5'
    }
];
//# sourceMappingURL=blocks.mock.js.map