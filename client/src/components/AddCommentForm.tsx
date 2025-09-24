import React from "react";
import type { NewComment } from "../types";

interface AddCommentFormProps {
  onSubmit: (newComment: NewComment, callback?: () => void) => void;
}
const AddCommentForm = ({ onSubmit }: AddCommentFormProps) => {
  const [author, setAuthor] = React.useState("");
  const [body, setBody] = React.useState("");
  const handleReset = () => {
    setAuthor("");
    setBody("");
  };
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit({ author, body }, handleReset);
  };
  return (
    <form action="" onSubmit={handleSubmit}>
      <h2>Post a Comment</h2>
      <div className="input-group">
        <label>Your Name</label>
        <input
          type="text"
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Your Comment</label>
        <textarea
          name="body"
          cols={30}
          rows={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddCommentForm;
