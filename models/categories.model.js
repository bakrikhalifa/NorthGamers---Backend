const db = require("../db/connection");

exports.getCategoriesData = () => {
    return db.query(`SELECT * FROM categories;`).then(({ rows: categories }) => {
      return categories;
    });
  };