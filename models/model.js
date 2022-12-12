const db = require("../db/connection");

exports.getCategoriesData = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.getReviewsData = () => {
  return db
    .query(`SELECT * FROM reviews ORDER BY created_at desc;`)
    .then(({ rows: reviews }) => {
      return reviews;
    });
};
