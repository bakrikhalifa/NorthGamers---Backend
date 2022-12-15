const db = require("../db/connection");

exports.checkIfCommentsExist = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then(({ rows: reviews }) => {
      if (reviews.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return true;
      }
    });
};

exports.checkIfCategoryExists = (queryObj) => {
  if (!queryObj.category) return Promise.resolve(true);
  else
    return db
      .query(`SELECT * FROM categories WHERE slug = $1`, [queryObj.category])
      .then(({ rowCount }) => {
        if (rowCount === 0) {
          return Promise.reject({ status: 404, msg: "Not Found" });
        } else {
          return true;
        }
      });
};
