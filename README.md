# Xano MCP Server

A Model Context Protocol (MCP) server implementation for interacting with the Xano API. This server provides tools and resources for managing Xano database operations through the MCP interface.

## Features

- Secure authentication with Xano API
- Type-safe API interactions using TypeScript
- Environment-based configuration
- MCP-compliant interface

## Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd xano_mcp

# Install dependencies
npm install
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your Xano credentials:
```env
XANO_API_KEY=your_api_key_here
XANO_API_URL=your_xano_api_url
NODE_ENV=development
API_TIMEOUT=10000
```

## Development

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Start the server
npm start
```

## Project Structure

```
xano_mcp/
├── src/
│   ├── api/
│   │   └── xano/
│   │       ├── services/    # API service implementations
│   │       └── types/       # TypeScript type definitions
│   ├── config.ts           # Configuration management
│   └── index.ts           # Main entry point
├── .env                   # Environment variables (not in git)
├── .env.example          # Example environment variables
└── tsconfig.json         # TypeScript configuration
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| XANO_API_KEY | Your Xano API authentication key | Yes | - |
| XANO_API_URL | Xano API endpoint URL | Yes | - |
| NODE_ENV | Environment (development/production) | No | development |
| API_TIMEOUT | API request timeout in milliseconds | No | 10000 |

## Usage

The server provides MCP tools for interacting with Xano:

```typescript
// Example usage in an MCP client
const result = await xano.auth(apiKey);
console.log('Authentication result:', result);
```

## Security

- Environment variables are used for sensitive configuration
- TruffleHog configuration is included to prevent secret leaks
- API keys and sensitive data are never committed to the repository

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

ISC
