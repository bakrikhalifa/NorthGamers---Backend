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
} = require("./controllers/controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByID);

app.post("/api/reviews/:review_id/comments", postCommentByID);

app.patch("/api/reviews/:review_id", patchReviewByID);

app.get("/api/users", getUsers);

// custom error
app.use((err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
});

// psql error
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

//incorrect path error
app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
