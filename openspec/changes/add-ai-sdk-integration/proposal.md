## Why

The project currently lacks a unified AI integration approach, with only direct OpenAI API usage and no abstraction layer for multiple providers or easy switching between AI models.

## What Changes

- Add Vercel AI SDK as core dependency for unified provider abstraction
- Create `packages/ai-sdk-integration/` with provider registry and configuration management
- Implement NestJS AI module with tRPC integration for backend AI operations
- Add React hooks and components for frontend AI interactions
- Support OpenAI and Anthropic providers with runtime switching capability
- **BREAKING**: Existing direct OpenAI usage will need migration to new SDK

## Impact

- Affected specs: New `ai-sdk-integration` capability
- Affected code: Backend services, frontend components, configuration management
- New dependencies: `ai` package from Vercel
- Migration path: Gradual transition from direct OpenAI API to AI SDK
- Security considerations: API key management, rate limiting, cost controls
- Performance implications: Caching layer, streaming optimization, connection pooling
