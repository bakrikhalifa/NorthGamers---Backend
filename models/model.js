const db = require("../db/connection");

exports.getCategoriesData = () => {
  return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
    return categories;
  });
};

exports.getReviewsData = (queryObj) => {
  const validSortByQueries = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];

  if (
    !validSortByQueries.includes(queryObj.sort_by) &&
    Object.keys(queryObj).length !== 0 &&
    !queryObj.hasOwnProperty("category") &&
    !queryObj.hasOwnProperty("order")
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request", code: "42703" });
  }

  if (
    !queryObj.hasOwnProperty("category") &&
    Object.keys(queryObj).length !== 0 &&
    !queryObj.hasOwnProperty("sort_by") &&
    !queryObj.hasOwnProperty("order")
  ) {
    return Promise.reject({ status: 404, msg: "Not Found" });
  }

  let queryString = `SELECT * FROM reviews`;
  const injectionParamArray = [];

  if (queryObj.hasOwnProperty("category")) {
    const categoryString = ` WHERE category = $1`;
    queryString += categoryString;
    injectionParamArray.push(queryObj.category);
  }

  if (queryObj.hasOwnProperty("sort_by")) {
    const sortByString = ` ORDER BY ${queryObj.sort_by} desc;`;
    queryString += sortByString;
  } else {
    const defaultSortBy = ` ORDER BY created_at desc`;
    queryString += defaultSortBy;
  }

  if (queryObj.hasOwnProperty("order")) {
    queryString = `SELECT * FROM reviews ORDER BY created_at ${queryObj.order}`;
  }

  return db
    .query(queryString, injectionParamArray)
    .then(({ rows: reviews }) => {
      return reviews;
    });
};

exports.getReviewByIDData = (review_id) => {
  const queryString = `SELECT reviews.*, COUNT (comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id`;

  return db.query(queryString, [review_id]).then(({ rows: review }) => {
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

exports.deleteCommentData = (comment_id) => {
  return db
    .query(
      `DELETE FROM comments
  WHERE comment_id = $1 RETURNING*;`,
      [comment_id]
    )
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return true;
    });
};
