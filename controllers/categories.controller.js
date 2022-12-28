const {getCategoriesData} = require('../models/categories.model')

exports.getCategories = (req, res) => {
    getCategoriesData().then((categories) => {
      res.status(200).send(categories);
    });
  };