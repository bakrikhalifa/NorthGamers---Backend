const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByID,
  postCommentByID,
  patchReviewByID,
  getUsers,
  deletecomment,
} = require("./controllers/controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByID);

app.post("/api/reviews/:review_id/comments", postCommentByID);

app.patch("/api/reviews/:review_id", patchReviewByID);

app.get("/api/users", getUsers);

app.delete("/api/comments/:comment_id", deletecomment);

// custom error
app.use((err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});

// psql errors
app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.code === "42703" ||
    err.code === "42601" ||
    err.code === "23502"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});

//incorrect path error
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
