<<<<<<< HEAD
const { getCategoriesData, getReviewsData } = require("../models/model");
=======
const categories = require("../db/data/test-data/categories");
const { getCategoriesData } = require("../models/model");
>>>>>>> main

exports.getCategories = (req, res, next) => {
  getCategoriesData().then((categories) => {
    res.status(200).send(categories);
  });
};
<<<<<<< HEAD

exports.getReviews = (req, res, next) => {
  getReviewsData().then((reviews) => {
    res.status(200).send(reviews);
  });
};
=======
>>>>>>> main
