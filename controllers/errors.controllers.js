exports.psqlErrors = (err, req, res, next) => {
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
};

exports.customErrors = (err, req, res, next) => {
  if (err.msg === "Not Found") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
};

exports.incorrectPathError = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};
