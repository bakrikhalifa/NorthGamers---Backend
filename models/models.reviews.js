const db = require("../db/connection");

exports.checkIfCommentsExist = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id]).then(({rows: reviews}) => {
        if(reviews.length === 0) {
           return Promise.reject({ status: 404, msg: "Not Found" })
        } else {
            return true
        }
    })
};
