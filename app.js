const express = require("express");
const app = express();
const { getCategories, getReviews } = require("./controllers/controller");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.use((req, res, next) => {
    res.status(500).send({msg: "Internal Server Error"})
})

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
