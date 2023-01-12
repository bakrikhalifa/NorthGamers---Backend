const e = require("express");
const db = require("../db/connection");

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
    "comment_count",
  ];
  
  if (
    !validSortByQueries.includes(queryObj.sort_by) &&
    Object.keys(queryObj).length !== 0 &&
    !queryObj.hasOwnProperty("category") &&
    !queryObj.hasOwnProperty("order") &&
    (!queryObj.hasOwnProperty("limit") || !queryObj.hasOwnProperty("p"))
    ) {
      return Promise.reject({ status: 400, msg: "Bad Request", code: "42703" });
    }
    
    if (
      !queryObj.hasOwnProperty("category") &&
      Object.keys(queryObj).length !== 0 &&
      !queryObj.hasOwnProperty("sort_by") &&
      !queryObj.hasOwnProperty("order") &&
      (!queryObj.hasOwnProperty("limit") || !queryObj.hasOwnProperty("p"))
      ) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      
      let queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) as comment_count
      FROM reviews
      LEFT JOIN comments ON reviews.review_id = comments.review_id
      GROUP BY reviews.review_id`;
      const injectionParamArray = [];
      
      if (queryObj.hasOwnProperty("category")) {
        queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) as comment_count
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id  WHERE category = $1
        GROUP BY reviews.review_id`;
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
        queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) as comment_count
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id ORDER BY created_at ${queryObj.order}`;
      }

      if (queryObj.hasOwnProperty("limit") && queryObj.limit.length === 0) {
        queryObj.limit = 10;
      }
      
      if (queryObj.hasOwnProperty("order") && queryObj.hasOwnProperty("sort_by")) {
        queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, review_img_url, reviews.review_body, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.comment_id) as comment_count
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        GROUP BY reviews.review_id ORDER BY ${queryObj.sort_by} ${queryObj.order}`;
      }

  return db
    .query(queryString, injectionParamArray)
    .then(({ rows: reviews }) => {
      //pagination
      if (queryObj.hasOwnProperty("limit") && queryObj.hasOwnProperty("p")) {
        const page = queryObj.p;
        const limit = queryObj.limit;
        const startIndexOfReviews = (page - 1) * limit;
        const endIndexOfReviews = page * limit;
        const queryResults = reviews.slice(
          startIndexOfReviews,
          endIndexOfReviews
        );

        if (queryResults.length === 0) {
          return Promise.reject({
            status: 400,
            msg: "Bad Request",
            code: "42703",
          });
        }

        return { reviews: reviews, queryResults: queryResults };
      } else {
        return { reviews: reviews };
      }
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

exports.getCommentsByIDData = (review_id, queryObj) => {
  if (
    Object.keys(queryObj).length !== 0 &&
    (!queryObj.hasOwnProperty("limit") || !queryObj.hasOwnProperty("p"))
  ) {
    return Promise.reject({ status: 400, msg: "Bad Request", code: "42703" });
  }

  if (queryObj.hasOwnProperty("limit") && queryObj.limit.length === 0) {
    queryObj.limit = 10;
  }

  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id FROM comments JOIN reviews ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 AND comments.review_id = $1 ORDER BY comments.created_at desc;`,
      [review_id]
    )
    .then(({ rows: comments }) => {
      if (queryObj.hasOwnProperty("limit") && queryObj.hasOwnProperty("p")) {
        const page = queryObj.p;
        const limit = queryObj.limit;
        const startIndexOfReviews = (page - 1) * limit;
        const endIndexOfReviews = page * limit;
        const queryResults = comments.slice(
          startIndexOfReviews,
          endIndexOfReviews
        );

        if (queryResults.length === 0) {
          return Promise.reject({
            status: 400,
            msg: "Bad Request",
            code: "42703",
          });
        }

        return queryResults;
      } else {
        return comments;
      }
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

exports.postReviewData = (newReview) => {
  const postReview = db.query(
    `INSERT INTO reviews (title, designer, owner, review_body, category) VALUES ($1, $2, $3, $4, $5) RETURNING*;`,
    [
      newReview.title,
      newReview.designer,
      newReview.owner,
      newReview.review_body,
      newReview.category,
    ]
  );

  const getReviewWithCount = db.query(
    `SELECT reviews.*, COUNT (comment_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE title = $1 GROUP BY reviews.review_id`,
    [newReview.title]
  );

  return Promise.all([postReview, getReviewWithCount]).then(
    ([postReview, getReviewWithCount]) => {
      return getReviewWithCount.rows[0];
    }
  );
};

exports.deleteReviewByIDData = (review_id) => {
  const deleteFromComments = db.query(
    `DELETE FROM comments
  WHERE review_id = $1 RETURNING*;`,
    [review_id]
  );

  const deleteFromReviews = db.query(
    `DELETE FROM reviews
  WHERE review_id = $1 RETURNING*;`,
    [review_id]
  );

  return Promise.all([deleteFromComments, deleteFromReviews]).then(
    ([deleteFromComments, deleteFromReviews]) => {
      if (deleteFromReviews.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
      }
      return;
    }
  );
};
