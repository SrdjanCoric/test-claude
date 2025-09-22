import React from "react";
import AddCommentForm from "./components/AddCommentForm";
import Comments from "./components/Comments";
import data from "./lib/mockData/comments";
import { type CommentWithReplies } from "./types/index.js";

const App = () => {
  const [comments, setComments] = React.useState<CommentWithReplies[]>([]);

  React.useEffect(() => {
    setComments(data);
  }, []);
  return (
    <div>
      <Comments comments={comments} />
      <AddCommentForm />
    </div>
  );
};

export default App;
