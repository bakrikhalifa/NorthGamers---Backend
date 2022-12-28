const db = require("../db/connection");

exports.getUsersData = () => {
    return db.query(`SELECT * FROM users;`).then(({ rows: users }) => {
      return users;
    });
  };

exports.getUsernameData = (username) => {
  return db.query(`SELECT * FROM users WHERE username = $1`, [username]).then(({rows: username}) => {
    if(username.length === 0) {
      return Promise.reject({status: 404, msg: "Not Found"})
    }
    return username[0]
  })
}