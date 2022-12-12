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

exports.getReviewByIDData = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows: review }) => {
      if (review[0] === undefined) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      } else {
        return review[0];
      }
    });
};
