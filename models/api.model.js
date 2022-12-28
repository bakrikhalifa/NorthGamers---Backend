const fs = require("fs/promises");

exports.endPointsJSONData = () => {
    return fs
      .readFile(`${__dirname}/../endpoints.json`, "utf-8")
      .then((endpoints) => {
        return JSON.parse(endpoints);
      });
  };