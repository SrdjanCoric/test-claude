# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack comment threading application with nested replies. React + TypeScript frontend, Express.js backend with JSON file storage.

## Commands

### Client (from /client directory)
- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Type-check and build for production
- `npm run lint` - Run ESLint
- `npm test` - Run Vitest tests once
- `npm run test:watch` - Run tests in watch mode

### Server (from /server directory)
- `npm start` - Start Express server on port 3001

### Running Both
Start server first (`npm start` in /server), then client (`npm run dev` in /client). The Vite dev server proxies `/api` requests to `http://localhost:3001`.

## Architecture

### Frontend (client/)
- **Components**: `App` → `Comments` & `AddCommentForm` → `CommentThread` → `Comment`
- **Services** (`services/comments.ts`): Axios HTTP client with Zod runtime validation
- **Types** (`types/index.ts`): Zod schemas that infer TypeScript types (schema-first approach)
- **State**: React hooks (`useState`, `useEffect`) with centralized state in App component

### Backend (server/)
- **server.js**: Express app with API routes
- **data/data.js**: Business logic and JSON file I/O
- **data/comments.json**: File-based data storage

### API Endpoints
- `GET /api/comments` - Fetch all comments with first reply each
- `GET /api/comment_replies?comment_id=xyz` - Fetch additional replies for a comment
- `POST /api/comments` - Create new top-level comment

## Code Style

Avoid adding comments during implementation. Code should be self-explanatory. Only add comments for very complex logic that cannot be simplified.

## Testing

Tests use Vitest with @testing-library/react. Test files are co-located with components (`*.test.tsx`). Services are mocked with `vi.mock()`. Run a single test file with `npm test -- ComponentName`.
