const express = require("express");
const app = express();
const {psqlErrors, customErrors, incorrectPathError} = require('./controllers/errors.controllers')
const apiRouter = require('./routers/api.router')

app.use(express.json());

app.use('/api', apiRouter)

app.set('json spaces', 2) 

//errors
app.use(customErrors);

app.use(psqlErrors);

app.all("*", incorrectPathError);

module.exports = app;
