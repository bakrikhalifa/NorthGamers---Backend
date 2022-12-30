const express = require('express')
reviewsRouter = express.Router()
const {getReviews, getReviewById, patchReviewByID, getCommentsByID, postCommentByID, postReview, deleteReviewID} = require('../controllers/reviews.controllers')

reviewsRouter
    .route("/")
    .get(getReviews)
    .post(postReview)

reviewsRouter
    .route("/:review_id")
    .get(getReviewById)
    .patch(patchReviewByID)
    .delete(deleteReviewID)

reviewsRouter
    .route("/:review_id/comments")
    .get(getCommentsByID)
    .post(postCommentByID)

    
module.exports = reviewsRouter