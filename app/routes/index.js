var express = require('express'),
    mainRouter = express.Router(),
    path = require('path'),
    request = require('request'),
    pkg = require(path.join(__dirname, '../../package.json')); //get the options from the package.json

/* GET home page. */
mainRouter.get('/', function (req, res, next) {
    res.render('index', {title: pkg.appName, desc: pkg.description, author: pkg.author});
});

mainRouter.use('/adaptor', require('./../modules/adaptors/foursquare/routes')); // render route
module.exports = mainRouter;
