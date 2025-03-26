# Noteum Web Package

## Overview

Noteum web application is a modern, responsive web interface built with cutting-edge web technologies. It provides a powerful and intuitive user interface for managing notes, workflows, and knowledge organization.

## Features

### Workflow Canvas with ReactFlow

The web application includes an interactive workflow canvas built with ReactFlow (@xyflow/react), allowing users to:

- Create and visualize complex workflows with nodes and connections
- Drag and drop nodes to design custom process flows
- Connect nodes to establish relationships and dependencies
- Zoom and pan across the canvas for easy navigation
- Customize node types (input, default, output)

## Prerequisites

- Node.js >= 22.0.0
- Bun >= 1.0.0

## Installation

```bash
bun install
```

## Development

Start the development server:

```bash
bun run dev
```

## Building

To build the project:

```bash
bun run build
```

## Testing

Run tests with coverage:

```bash
bun test
```

## Project Structure

- `app/`: Main application code
  - `routes/`: Application routes using TanStack Router
    - `-components/`: Component directories for specific routes
    - `flow/`: ReactFlow implementation and components
- `components/`: Reusable UI components
- `hooks/`: Custom React hooks
- `utils/`: Utility functions

## ReactFlow Implementation

The workflow canvas is implemented using ReactFlow and can be accessed at the `/flow` route. Key implementation details:

- Client-side rendering with React
- Custom node types for different workflow steps
- Interactive connection creation between nodes
- Drag-and-drop node positioning
- Zoom and pan controls for canvas navigation
- Control panel with usage instructions

### Usage Example

```tsx
// Import ReactFlow components
import { ReactFlow, addEdge, useNodesState, useEdgesState } from '@xyflow/react'
import type { Connection, Edge, Node } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Define initial nodes and edges
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  // Additional nodes...
]

// Create flow component
function FlowComponent() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  // Handle new connections
  const onConnect = (params: Connection) => {
    setEdges((eds) => addEdge(params, eds))
  }
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    />
  )
}
```

## Technologies

- React
- TypeScript
- TanStack Router
- ReactFlow (@xyflow/react)
- Tailwind CSS
- Bun

## Contributing

Please read the project's contributing guidelines before submitting pull requests.
