const {
  endPointsJSONData,
} = require("../models/api.model");

exports.endPointsJSON = (req, res) => {
  endPointsJSONData().then((endpoints) => {
    res.status(200).send({ endpoints });
  });
};
