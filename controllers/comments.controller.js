const {
  deleteCommentData,
  patchCommentVotesData,
} = require("../models/comments.model");

exports.deletecomment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentData(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  patchCommentVotesData(comment_id, inc_votes).then((updatedComment) => {
    res.status(200).send(updatedComment)
  }).catch(err => {
    next(err)
  })
};
