import type { CommentWithReplies } from "../types";
import Comment from "./Comment";

interface CommentThreadProps {
  comment: CommentWithReplies;
}

const CommentThread = ({ comment }: CommentThreadProps) => {
  return (
    <div className="parent-comment">
      <Comment
        author={comment.author}
        body={comment.body}
        postedAt={comment.postedAt}
      />
      <div className="replies">
        {comment.replies.map((reply) => (
          <Comment
            key={reply.id}
            author={reply.author}
            body={reply.body}
            postedAt={reply.postedAt}
          />
        ))}
        <a href="#" className="show_more">
          Show More Replies (2)
        </a>
      </div>
    </div>
  );
};
export default CommentThread;
