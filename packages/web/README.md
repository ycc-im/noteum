# Noteum Web Package

## Overview
Noteum web application is a modern, responsive web interface built with cutting-edge web technologies.

## Prerequisites
- Bun >= 1.0.0

## Installation
```bash
bun install
```

## Development
To start the development server:

the bese way is using `bun docker:dev` command from root directory.

another way is using `bun run dev` command from package directory.

```bash
bun docker:dev // root directory

or

bun run dev // package web directory
```

you can visit http://localhost:{WEB_PORT} to see the result. by default, it is http://localhost:9527.

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
- `src/`: Source code
- `components/`: Reusable UI components
- `hooks/`: Custom React hooks
- `utils/`: Utility functions

## Technologies
- React
- TypeScript
- Bun

## Contributing
Please read the project's contributing guidelines before submitting pull requests.
