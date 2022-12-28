const db = require("../db/connection");

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

  exports.patchCommentVotesData = (comment_id, inc_votes) => {
    return db.query(`UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2 RETURNING*;`, [inc_votes, comment_id]).then(({rows: updatedComment}) => {
      if(updatedComment.length === 0) {
        return Promise.reject({status: 404, msg: "Not Found"})
      }
      return updatedComment[0]
    })
  }