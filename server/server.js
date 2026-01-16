const express = require('express');
const bodyParser = require('body-parser');

const { getCommentsWithOneReply, getRepliesForComment, saveComment, deleteComment, deleteReply } = require('./data/data');

const app = express();

app.set('port', (process.env.API_PORT || 3001));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/comments', (req, res) => {
  res.json(getCommentsWithOneReply());
});

app.get('/api/comment_replies', (req, res) => {
  const comment_id = req.query.comment_id;
  res.json(getRepliesForComment(comment_id));
});

app.post('/api/comments', (req, res) => {
  const comment = req.body;
  const newComment = saveComment(comment);
  if (newComment) {
    res.json(newComment);
  } else {
    res.status(401).json({error: 'Please check your inputs'});
  }
});

app.post('/api/comment_replies', (req, res) => {
  const comment_id = +req.params.comment_id;

  const { comment_reply } = req.params;
  const newReply = saveReplyToComment(comment_id, reply);
  if (newReply) {
    res.json(newReply);
  } else {
    res.status(401).json({error: 'Please check your inputs'});
  }
});

app.delete('/api/comments/:id', (req, res) => {
  const deleted = deleteComment(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Comment not found" });
  res.json({ success: true, deleted });
});

app.delete('/api/comments/:commentId/replies/:replyId', (req, res) => {
  const deleted = deleteReply(req.params.commentId, req.params.replyId);
  if (!deleted) return res.status(404).json({ error: "Reply not found" });
  res.json({ success: true, deleted });
});

app.use((req, res) => {
  res.status(404).send({error: 'Not found'});
});

module.exports = app;