const {
  getCategoriesData,
  getReviewsData,
  getReviewByIDData,
} = require("../models/model");

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
