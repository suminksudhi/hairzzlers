var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./app/routes/index');

var adminDriver = express();

// view engine setup
adminDriver.set('trust proxy', ['loopback','127.0.0.1']) ;
adminDriver.set('views', path.join(__dirname, 'views'));
adminDriver.engine('html', require('ejs').renderFile);
adminDriver.set('view engine', 'html');

// uncomment after placing your favicon in /public
adminDriver.use(favicon(path.join(__dirname, 'assets/img/common/favicon.ico')));
adminDriver.use(logger('dev'));
adminDriver.use(bodyParser.json());
adminDriver.use(bodyParser.urlencoded({extended: false}));
adminDriver.use(cookieParser());
//adminDriver.use(require('less-middleware')(path.join(__dirname, 'public')));
adminDriver.use(express.static(path.join(__dirname, 'assets')));

//initialize all routers
adminDriver.use('/', routes);

// catch 404 and forward to error handler
adminDriver.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// development error handler
// will print stacktrace
if (adminDriver.get('env') === 'development') {
    adminDriver.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    adminDriver.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}


module.exports = adminDriver;
