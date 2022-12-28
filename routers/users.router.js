const express = require('express')
const {getUsers, getUsernames} = require('../controllers/users.controllers')
const usersRouter = express.Router()

usersRouter
    .route('/')
    .get(getUsers)

usersRouter
    .route('/:username')
    .get(getUsernames)
module.exports = usersRouter