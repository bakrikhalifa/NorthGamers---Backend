const {getUsersData, getUsernameData} = require('../models/users.model')

exports.getUsers = (req, res, next) => {
    getUsersData().then((users) => {
      res.status(200).send(users);
    });
  };

exports.getUsernames = (req, res, next) => {
  const {username} = req.params
  getUsernameData(username).then((username) => {
    res.status(200).send(username);
  }).catch(err => {
    next(err)
  })
};