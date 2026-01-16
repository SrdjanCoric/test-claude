const { readFileSync, writeFileSync } = require('fs');
const {v4: uuidv4} = require('uuid');
const path = require('path');
const stringify = require('json-beautify');
const DATA_FILE_PATH = path.join(__dirname, 'comments.json');

const data = {
  getCommentsWithOneReply: () => {
    const comments = JSON.parse(readFileSync(DATA_FILE_PATH));
    return comments.map((c) => Object.assign({}, c, {replies: c.replies.slice(0, 1)}));
  },

  getRepliesForComment: (id) => {
    const comments = JSON.parse(readFileSync(DATA_FILE_PATH));
    return comments.find((c) => c.id === id).replies.slice(1);
  },

  saveComment: (commentFields) => {
    const newComment = Object.assign(
                        {},
                        commentFields,
                        {
                          id: uuidv4(),
                          postedAt: +Date.now(),
                          replies_count: 0,
                          replies: []
                        }
    );

    let comments = JSON.parse(readFileSync(DATA_FILE_PATH));
    comments = comments.concat(newComment);
    writeFileSync(DATA_FILE_PATH, stringify(comments, null, 2, 100));
    return newComment;
  },

  deleteComment: (commentId) => {
    const comments = JSON.parse(readFileSync(DATA_FILE_PATH));
    const index = comments.findIndex(c => c.id === commentId);
    if (index === -1) return null;
    const deleted = comments.splice(index, 1)[0];
    writeFileSync(DATA_FILE_PATH, stringify(comments, null, 2, 100));
    return deleted;
  },

  deleteReply: (commentId, replyId) => {
    const comments = JSON.parse(readFileSync(DATA_FILE_PATH));
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return null;
    const replyIndex = comment.replies.findIndex(r => r.id === replyId);
    if (replyIndex === -1) return null;
    const deleted = comment.replies.splice(replyIndex, 1)[0];
    comment.replies_count = comment.replies.length;
    writeFileSync(DATA_FILE_PATH, stringify(comments, null, 2, 100));
    return deleted;
  }
}

module.exports = data;