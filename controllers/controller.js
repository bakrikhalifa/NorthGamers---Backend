const { getCategoriesData, getReviewsData } = require("../models/model");

exports.getCategories = (req, res, next) => {
  getCategoriesData().then((categories) => {
    res.status(200).send(categories);
  });
};

exports.getReviews = (req, res, next) => {
  getReviewsData().then((reviews) => {
    res.status(200).send(reviews);
  });
};
