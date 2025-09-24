import React from "react";
import AddCommentForm from "./components/AddCommentForm";
import Comments from "./components/Comments";
import { type CommentWithReplies, type NewComment } from "./types/index.js";
import {
  createComment,
  getComments,
  getMoreReplies,
} from "./services/comments.js";
import { ZodError } from "zod";

const App = () => {
  const [comments, setComments] = React.useState<CommentWithReplies[]>([]);

  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments();
        setComments(data);
      } catch (e: unknown) {
        if (e instanceof ZodError) {
          console.log(e);
        }
        console.log(e);
      }
    };
    fetchComments();
  }, []);

  // Name handleSomething when you are defining it

  // Name onSomething when you are passing it as a prop

  const handleMoreReplies = async (commentId: string) => {
    try {
      const data = await getMoreReplies(commentId);

      setComments((prevComments) => {
        return prevComments.map((c) => {
          if (c.id === commentId) {
            return { ...c, replies: c.replies.concat(data) };
          } else {
            return c;
          }
        });
      });
    } catch (e: unknown) {
      console.log(e);
    }
  };

  const handleSubmit = async (
    newComment: NewComment,
    callback?: () => void
  ) => {
    try {
      const data = await createComment(newComment);
      setComments((prevComments) => prevComments.concat(data));
      if (callback) {
        callback();
      }
    } catch (e: unknown) {
      console.log(e);
    }
  };

  return (
    <div>
      <Comments comments={comments} onMoreReplies={handleMoreReplies} />
      <AddCommentForm onSubmit={handleSubmit} />
    </div>
  );
};

export default App;
