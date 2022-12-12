const express = require("express");
const app = express();
<<<<<<< HEAD
const { getCategories, getReviews } = require("./controllers/controller");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

=======
const { getCategories } = require("./controllers/controller");

app.get("/api/categories", getCategories);

>>>>>>> main
app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
