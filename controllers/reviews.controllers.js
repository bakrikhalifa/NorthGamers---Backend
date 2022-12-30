const {
  getReviewsData,
  getReviewByIDData,
  patchReviewByIDData,
  getCommentsByIDData,
  postCommentByIDData,
  postReviewData,
  deleteReviewByIDData,
} = require("../models/reviews.model");
const {
  checkIfCategoryExists,
  checkIfCommentsExist,
} = require("../models/checkIf.model");

exports.getReviews = (req, res, next) => {
  const promises = [getReviewsData(req.query)];
  if (req.query.category !== undefined) {
    promises.push(checkIfCategoryExists(req.query));
  }
  Promise.all(promises)
    .then((response) => {
      if (response[0].hasOwnProperty("queryResults")) {
        res.status(200).send({
          total_count: response[0].reviews.length,
          queryResults: response[0].queryResults,
        });
      } else {
        res.status(200).send({
          total_count: response[0].reviews.length,
          reviews: response[0].reviews,
        });
      }
    })
    .catch((err) => {
      next(err);
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

exports.getCommentsByID = (req, res, next) => {
  const { review_id } = req.params;
  const promises = [
    getCommentsByIDData(review_id, req.query),
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

exports.postReview = (req, res, next) => {
  const newReview = req.body;
  postReviewData(newReview)
    .then((reviewWithCount) => {
      res.status(201).send(reviewWithCount);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteReviewID = (req, res, next) => {
  const { review_id } = req.params;
  deleteReviewByIDData(review_id)
    .then((deleted) => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};
