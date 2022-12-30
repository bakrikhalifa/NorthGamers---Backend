const db = require("../db/connection");

exports.getCategoriesData = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.postCategoryData = (newCategory) => {
  return db
    .query(
      `INSERT INTO categories (slug, description)
  VALUES ($1, $2)
  RETURNING*;`,
      [newCategory.slug, newCategory.description]
    )
    .then(({ rows: newCategory }) => {
      return newCategory[0];
    });
};
