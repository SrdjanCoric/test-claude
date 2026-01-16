# Delete Comment Feature Implementation Plan

## Overview
Add delete functionality for both top-level comments and replies, with a delete button that blends with the existing UI style.

## Files to Modify

### Server
- `server/data/data.js` - Add delete functions
- `server/server.js` - Add DELETE endpoints

### Client
- `client/src/services/comments.ts` - Add delete API functions
- `client/src/types/index.ts` - Add delete response schema (if needed)
- `client/src/components/Comment.tsx` - Add delete button UI
- `client/src/components/CommentThread.tsx` - Pass delete callback
- `client/src/components/Comments.tsx` - Pass delete callback
- `client/src/components/App.tsx` - Implement delete handlers

### Tests
- `client/src/components/Comment.test.tsx` - Create new test file
- `client/src/components/App.test.tsx` - Add delete integration tests

---

## Implementation Steps

### 1. Backend: Data Layer (`server/data/data.js`)

Add two functions:

```javascript
const deleteComment = (commentId) => {
  const comments = JSON.parse(fs.readFileSync(dataPath));
  const index = comments.findIndex(c => c.id === commentId);
  if (index === -1) return null;
  const deleted = comments.splice(index, 1)[0];
  fs.writeFileSync(dataPath, beautify(comments, null, 2, 80));
  return deleted;
};

const deleteReply = (commentId, replyId) => {
  const comments = JSON.parse(fs.readFileSync(dataPath));
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return null;
  const replyIndex = comment.replies.findIndex(r => r.id === replyId);
  if (replyIndex === -1) return null;
  const deleted = comment.replies.splice(replyIndex, 1)[0];
  comment.replies_count = comment.replies.length;
  fs.writeFileSync(dataPath, beautify(comments, null, 2, 80));
  return deleted;
};
```

Export both functions.

### 2. Backend: API Routes (`server/server.js`)

Add two DELETE endpoints:

```javascript
// Delete top-level comment
app.delete("/api/comments/:id", (req, res) => {
  const deleted = deleteComment(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Comment not found" });
  res.json({ success: true, deleted });
});

// Delete reply
app.delete("/api/comments/:commentId/replies/:replyId", (req, res) => {
  const deleted = deleteReply(req.params.commentId, req.params.replyId);
  if (!deleted) return res.status(404).json({ error: "Reply not found" });
  res.json({ success: true, deleted });
});
```

### 3. Frontend: Service Layer (`client/src/services/comments.ts`)

Add delete functions:

```typescript
export const deleteComment = async (commentId: string) => {
  const { data } = await axios.delete(`/api/comments/${commentId}`);
  return data;
};

export const deleteReply = async (commentId: string, replyId: string) => {
  const { data } = await axios.delete(`/api/comments/${commentId}/replies/${replyId}`);
  return data;
};
```

### 4. Frontend: Comment Component (`client/src/components/Comment.tsx`)

Update props to include delete callback and IDs:

```typescript
type CommentProps = Pick<CommentType, "author" | "body" | "postedAt"> & {
  id: string;
  commentId?: string; // Parent comment ID (for replies)
  onDelete: (id: string, commentId?: string) => void;
};
```

Add delete button styled to match UI:
- Small "Delete" text link or icon button
- Position: top-right of comment or below the comment body
- Style: subtle, matches the "Show More Replies" link style

### 5. Frontend: CommentThread Component (`client/src/components/CommentThread.tsx`)

Pass `onDelete` callback through to Comment components for both the parent comment and replies.

### 6. Frontend: Comments Component (`client/src/components/Comments.tsx`)

Accept `onDelete` prop and pass to CommentThread.

### 7. Frontend: App Component (`client/src/components/App.tsx`)

Add handler function:

```typescript
const handleDelete = async (id: string, commentId?: string) => {
  try {
    if (commentId) {
      // Deleting a reply
      await deleteReply(commentId, id);
      setComments(prev => prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: c.replies.filter(r => r.id !== id),
            replies_count: c.replies_count - 1
          };
        }
        return c;
      }));
    } else {
      // Deleting top-level comment
      await deleteComment(id);
      setComments(prev => prev.filter(c => c.id !== id));
    }
  } catch (e) {
    console.log(e);
  }
};
```

Pass `handleDelete` to Comments component.

---

## UI Design

The delete button should:
- Be a text link styled like "Show More Replies" (subtle, gray/blue text)
- Display "Delete" text
- Position: After the comment body, aligned left
- Show on hover or always visible (simpler)

Example placement in Comment component:
```
┌────────────────────────────────┐
│ [Avatar] Author Name           │
│          7 years ago           │
│                                │
│ Comment body text here...      │
│                                │
│ Delete                         │  ← New delete link
└────────────────────────────────┘
```

---

## Testing Plan

### Component Tests (`Comment.test.tsx` - new file)

1. **Renders delete button** - Verify button is visible
2. **Calls onDelete with correct ID** - Click button, verify callback called with comment ID
3. **Calls onDelete with both IDs for reply** - Verify commentId passed for replies

### Integration Tests (`App.test.tsx` - add to existing)

1. **Deletes top-level comment** - Mock deleteComment, click delete, verify comment removed from DOM
2. **Deletes reply** - Mock deleteReply, click delete on reply, verify reply removed from DOM
3. **Handles delete error gracefully** - Mock rejected promise, verify error handling

### Manual Testing

1. Start server (`npm start` in /server)
2. Start client (`npm run dev` in /client)
3. Delete a top-level comment - verify it disappears
4. Delete a reply - verify it disappears and count updates
5. Refresh page - verify deletions persisted

---

## Verification

After implementation:

1. Run tests: `cd client && npm test`
2. Manual test in browser:
   - Delete top-level comment
   - Delete nested reply
   - Verify persistence after refresh
