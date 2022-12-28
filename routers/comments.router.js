const express = require('express')
const {deletecomment, patchCommentVotes} = require('../controllers/comments.controller')
const commentsRouter = express.Router()

commentsRouter
    .route('/:comment_id')
    .delete(deletecomment)
    .patch(patchCommentVotes)


module.exports = commentsRouter