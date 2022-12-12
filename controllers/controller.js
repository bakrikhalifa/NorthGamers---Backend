const categories = require("../db/data/test-data/categories");
const { getCategoriesData } = require("../models/model");

exports.getCategories = (req, res, next) => {
  getCategoriesData().then((categories) => {
    res.status(200).send(categories);
  });
};
