const express = require('express')
const categoriesRouter = require('./categories.router')
const reviewsRouter = require('./reviews.router')
const usersRouter = require('./users.router')
const commentsRouter = require('./comments.router')
const apiRouter = express.Router()
const {endPointsJSON} = require('../controllers/api.controller')

apiRouter
    .route('/')
    .get(endPointsJSON)

apiRouter.use('/categories', categoriesRouter)
apiRouter.use('/reviews', reviewsRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter