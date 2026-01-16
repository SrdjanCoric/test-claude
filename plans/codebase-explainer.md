# Comments App - Developer Onboarding Guide

## 1. Project Overview

### What is this?
A full-stack comment threading application with nested replies. Users can view comments, expand reply threads on-demand, and create new top-level comments. Built as an educational project demonstrating modern React patterns with a simple Express backend.

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 19.1.1 |
| Language | TypeScript 5.8.3 |
| Build Tool | Vite 7.1.7 |
| HTTP Client | Axios 1.12.2 |
| Validation | Zod 4.1.11 |
| Backend | Express.js 4.17.1 |
| Data Storage | JSON file |
| Testing | Vitest 3.2.4 + React Testing Library |

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `zod` | Schema-first runtime validation with TypeScript inference |
| `axios` | HTTP client for API calls |
| `moment` | Human-readable relative timestamps |
| `uuid` | Unique ID generation for comments |
| `faker` | Seed data generation for development |

---

## 2. Architecture

### High-Level Overview

```
[Browser] → [Vite Dev Server :5173] → [Express API :3001] → [JSON File Storage]
                    ↓ (proxy /api)           ↓
              React Components         data/comments.json
```

### Component Hierarchy

```
App (state management)
├── Comments (list container)
│   └── CommentThread (parent + replies)
│       └── Comment (single comment/reply with avatar)
└── AddCommentForm (new comment form)
```

### Data Flow

1. **Initial Load:** App mounts → `getComments()` → fetches all comments with first reply each
2. **Lazy Loading:** User clicks "Show More Replies" → `getMoreReplies(id)` → merges additional replies
3. **Create Comment:** User submits form → `createComment(data)` → appends to state

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/comments` | Fetch all comments with first reply |
| GET | `/api/comment_replies?comment_id=xyz` | Fetch additional replies for a comment |
| POST | `/api/comments` | Create new top-level comment |

---

## 3. Project Structure

```
comments-claude-code/
├── client/                      # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── main.tsx            # React entry point
│   │   ├── App.tsx             # Root component, state management
│   │   ├── index.css           # Global styles
│   │   ├── components/
│   │   │   ├── Comments.tsx        # Comment list container
│   │   │   ├── CommentThread.tsx   # Parent comment + replies wrapper
│   │   │   ├── Comment.tsx         # Single comment display
│   │   │   └── AddCommentForm.tsx  # New comment form
│   │   ├── types/index.ts      # Zod schemas + TypeScript types
│   │   ├── services/comments.ts # API client functions
│   │   └── lib/                # Utility functions
│   ├── vite.config.ts          # Vite + proxy config
│   ├── tsconfig.app.json       # TypeScript config
│   └── package.json
│
├── server/                      # Backend (Express.js)
│   ├── server.js               # Express app + routes
│   ├── start-server.js         # Server entry point
│   ├── data/
│   │   ├── data.js             # Business logic + file I/O
│   │   └── comments.json       # Data storage
│   ├── seedData.js             # Generate sample data
│   └── package.json
│
└── CLAUDE.md                   # Project instructions
```

### Key Files Explained

- **`client/src/types/index.ts`** - Zod schemas define data contracts; TypeScript types are inferred
- **`client/src/services/comments.ts`** - Axios HTTP client with Zod validation on responses
- **`server/data/data.js`** - CRUD operations for comments with JSON file persistence
- **`vite.config.ts`** - Configures `/api` proxy to `localhost:3001`

---

## 4. Getting Started

### Prerequisites
- Node.js >= 18
- npm

### Initial Setup

```bash
# Clone repository
git clone <repo>
cd comments-claude-code

# Install dependencies
cd server && npm install
cd ../client && npm install

# Seed sample data (optional)
cd ../server
node seedData.js
```

### Running the Application

```bash
# Terminal 1: Start backend
cd server
npm start
# Server runs on http://localhost:3001

# Terminal 2: Start frontend
cd client
npm run dev
# App runs on http://localhost:5173
```

### Verify Setup

```bash
# Check API
curl http://localhost:3001/api/comments

# Run tests
cd client && npm test
```

---

## 5. Development Workflow

### Available Scripts

**Client (`/client`):**
```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Type-check + production build
npm run lint       # Run ESLint
npm test           # Run Vitest once
npm run test:watch # Watch mode testing
```

**Server (`/server`):**
```bash
npm start          # Start Express server on port 3001
```

### Making Changes

1. Create feature branch from `new_ui`
2. Make changes with tests
3. Run `npm run lint && npm test`
4. Open PR for review

---

## 6. Conventions & Patterns

### Schema-First Type Safety

Types are defined using Zod schemas, then inferred for TypeScript:

```typescript
// types/index.ts
export const commentSchema = z.object({
  id: z.string(),
  author: z.string(),
  body: z.string(),
  postedAt: z.number(),
});

export type Comment = z.infer<typeof commentSchema>;
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CommentThread.tsx` |
| Functions | camelCase | `getComments()` |
| Handlers | `handle*` prefix | `handleSubmit()` |
| Callback Props | `on*` prefix | `onMoreReplies` |

### State Management Pattern

- State centralized in `App` component
- Data flows down via props
- Events flow up via callback functions
- Immutable updates with spread operator

### API Response Validation

All API responses are validated with Zod before use:

```typescript
const res = await axios.get("/api/comments");
return commentWithRepliesSchema.array().parse(res.data);
```

---

## 7. Data Models

### Comment Structure

```typescript
interface Comment {
  id: string;           // UUID v4
  author: string;       // Author name
  body: string;         // Comment text
  postedAt: number;     // Timestamp (ms)
}

interface CommentWithReplies extends Comment {
  replies_count: number; // Total replies
  replies: Reply[];      // Loaded replies (paginated)
}

interface Reply extends Comment {
  comment_id: string;   // Parent comment ID
}
```

### JSON Storage Format

```json
[
  {
    "id": "abc-123",
    "author": "Jane Doe",
    "body": "Great post!",
    "postedAt": 1705000000000,
    "replies_count": 3,
    "replies": [
      { "id": "xyz-789", "comment_id": "abc-123", "author": "John", "body": "Thanks!", "postedAt": 1705000001000 }
    ]
  }
]
```

---

## 8. Testing

### Test Structure

Tests are co-located with components:
```
components/
├── Comment.tsx
├── Comment.test.tsx
├── CommentThread.tsx
├── CommentThread.test.tsx
```

### Running Tests

```bash
npm test                    # Run all tests once
npm run test:watch          # Watch mode
npm test -- Comment.test    # Run specific file
```

### Testing Patterns

```typescript
// Mock services
vi.mock("./services/comments.ts");

// Setup mocks
vi.mocked(getComments).mockResolvedValue(mockComments);

// Render and query
render(<App />);
const author = await screen.findByRole("heading", { name: "Jane" });
expect(author).toBeInTheDocument();

// User interactions
const user = userEvent.setup();
await user.click(screen.getByRole("link", { name: /show more/i }));
```

---

## 9. Common Tasks

### Add a New Component

1. Create `ComponentName.tsx` in `client/src/components/`
2. Define props interface
3. Import and use in parent component
4. Add `ComponentName.test.tsx` for tests

### Modify API Response Handling

1. Update Zod schema in `client/src/types/index.ts`
2. TypeScript types auto-update via inference
3. Update service function in `client/src/services/comments.ts`
4. Validation errors caught at runtime

### Add New API Endpoint

1. Add route in `server/server.js`
2. Add data function in `server/data/data.js`
3. Add service function in `client/src/services/comments.ts`
4. Add Zod schema for response validation

---

## 10. Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :3001
# Kill it
kill -9 <PID>
```

### CORS Errors

- Ensure server is running on port 3001
- Check Vite proxy config in `vite.config.ts`

### Type Errors

```bash
# Run type check
cd client && npx tsc --noEmit
```

### Tests Failing

- Ensure mocks are properly set up
- Check that `vi.mock()` paths match imports
- Use `screen.debug()` to inspect rendered output

---

## 11. Quick Reference

```bash
# Development
cd client && npm run dev     # Frontend dev server
cd server && npm start       # Backend server

# Testing
cd client && npm test        # Run tests
cd client && npm run lint    # Lint code

# Build
cd client && npm run build   # Production build
```

### Key URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api/comments
