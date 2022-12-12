const { getCategoriesData, getReviewsData } = require("../models/model");

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
