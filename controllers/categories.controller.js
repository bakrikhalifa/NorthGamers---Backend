const {getCategoriesData, postCategoryData} = require('../models/categories.model')

exports.getCategories = (req, res) => {
    getCategoriesData().then((categories) => {
      res.status(200).send(categories);
    });
  };

  exports.postCategory = (req, res, next) => {
    const newCategory = req.body
    postCategoryData(newCategory).then(newCategory => {
      res.status(201).send(newCategory)
    }).catch(err => {
      next(err)
    })
  };