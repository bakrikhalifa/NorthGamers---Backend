const {
  getCategoriesData,
  getReviewsData,
  getReviewByIDData,
  getCommentsByIDData,
  postCommentByIDData,
  patchReviewByIDData,
  getUsersData,
  deleteCommentData,
  endPointsJSONData,
} = require("../models/model");

const {
  checkIfCommentsExist,
  checkIfCategoryExists,
} = require("../models/models.reviews");

exports.getCategories = (req, res) => {
  getCategoriesData().then((categories) => {
    res.status(200).send(categories);
  });
};

exports.getReviews = (req, res, next) => {
  const promises = [getReviewsData(req.query)];
  if (req.query.category !== undefined) {
    promises.push(checkIfCategoryExists(req.query));
  }
  Promise.all(promises)
    .then(([reviews]) => {
      res.status(200).send(reviews);
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

exports.getUsers = (req, res, next) => {
  getUsersData().then((users) => {
    res.status(200).send(users);
  });
};

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

exports.endPointsJSON = (req, res) => {
  endPointsJSONData().then((endpoints) => {
    const stringified = JSON.stringify(endpoints)
    res.status(200).send({ stringified });
  });
};
