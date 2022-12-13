const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewById,
} = require("./controllers/controller");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.use((err, req, res, next) => {
  if (err.msg !== undefined) {
    res.status(404).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err)
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
