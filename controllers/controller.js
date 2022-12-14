const {
  getCategoriesData,
  getReviewsData,
  getReviewByIDData,
  getCommentsByIDData,
  postCommentByID,
  postCommentByIDData,
  patchReviewByIDData,
} = require("../models/model");

const { checkIfCommentsExist } = require("../models/models.reviews");

exports.getCategories = (req, res) => {
  getCategoriesData().then((categories) => {
    res.status(200).send(categories);
  });
};

exports.getReviews = (req, res) => {
  getReviewsData().then((reviews) => {
    res.status(200).send(reviews);
  });
};

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  getReviewByIDData(review_id)
    .then((review) => {
      res.status(200).send(review);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByID = (req, res, next) => {
  const { review_id } = req.params;
  const promises = [
    getCommentsByIDData(review_id),
    checkIfCommentsExist(review_id),
  ];
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByID = (req, res, next) => {
  const newComment = req.body;
  const { review_id } = req.params;

  postCommentByIDData(review_id, newComment)
    .then((newComment) => {
      res.status(201).send(newComment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewByID = (req, res, next) => {
  const updatedReviewBody = req.body;
  const { review_id } = req.params;

  patchReviewByIDData(review_id, updatedReviewBody)
    .then((updatedReview) => {
      res.status(200).send(updatedReview);
    })
    .catch((err) => {
      next(err);
    });
};
