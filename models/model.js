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
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return review[0];
      }
    });
};

exports.getCommentsByIDData = (review_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id FROM comments JOIN reviews ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 AND comments.review_id = $1 ORDER BY comments.created_at desc;`,
      [review_id]
    )
    .then(({ rows: comments }) => {
      return comments;
    });
};

exports.postCommentByIDData = (review_id, newComment) => {
  return db
    .query(
      `INSERT INTO comments (body, review_id, author)
        VALUES ($1, $2, $3)
        RETURNING*;`,
      [newComment.body, review_id, newComment.username]
    )
    .then(({ rows: newComment }) => {
      return newComment[0];
    });
};

exports.patchReviewByIDData = (review_id, updatedReviewBody) => {
  return db
    .query(
      `UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2 RETURNING*;`,
      [updatedReviewBody.inc_votes, review_id]
    )
    .then(({ rows: updatedReview }) => {
      if (updatedReview.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return updatedReview[0];
    });
};

exports.getUsersData = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
    return users;
  });
};
