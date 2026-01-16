import type { CommentWithReplies } from "../types";
import Comment from "./Comment";

interface CommentThreadProps {
  comment: CommentWithReplies;
  onMoreReplies: (commentId: string) => void;
  onDelete: (id: string, commentId?: string) => void;
}

const CommentThread = ({
  comment,
  onMoreReplies,
  onDelete,
}: CommentThreadProps) => {
  return (
    <div className="parent-comment">
      <Comment
        id={comment.id}
        author={comment.author}
        body={comment.body}
        postedAt={comment.postedAt}
        onDelete={onDelete}
      />
      <div className="replies">
        {comment.replies.map((reply) => {
          return (
            <Comment
              key={reply.id}
              id={reply.id}
              commentId={comment.id}
              author={reply.author}
              body={reply.body}
              postedAt={reply.postedAt}
              onDelete={onDelete}
            />
          );
        })}
        {comment.replies_count === comment.replies.length ? null : (
          <a
            href="#"
            className="show_more"
            onClick={(e) => {
              e.preventDefault();
              onMoreReplies(comment.id);
            }}
          >
            Show More Replies ({comment.replies_count - 1})
          </a>
        )}
      </div>
    </div>
  );
};
export default CommentThread;

// interface CommentThreadProps {
//   comment: CommentWithReplies;
//   setComments: React.Dispatch<React.SetStateAction<CommentWithReplies[]>>;
// }

// const handleMoreReplies = async (e: React.SyntheticEvent) => {
//   e.preventDefault();
//   const { data } = await axios.get(
//     `/api/comment_replies?comment_id=${comment.id}`
//   );

//   setComments((prevComments) => {
//     return prevComments.map((c) => {
//       if (c.id === comment.id) {
//         return { ...c, replies: c.replies.concat(data) };
//       } else {
//         return c;
//       }
//     });
//   });
// };
