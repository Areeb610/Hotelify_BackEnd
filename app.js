var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql');
const db = require('./database/db');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var hotelLoginRouter = require('./routes/hotelLogin');
var hotelSignupRouter = require('./routes/hotelSignup');
var roomsRouter = require('./routes/rooms');
var bookingRouter = require('./routes/booking');
var reviewRouter = require('./routes/reviews');
var contactRouter = require('./routes/contact');
var adminBookingRouter = require('./routes/admin');
const exp = require('constants');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors()); // Enable CORS
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', hotelLoginRouter);
app.use('/signup', hotelSignupRouter);
app.use('/rooms', roomsRouter);
app.use('/booking', bookingRouter);
app.use('/reviews', reviewRouter);
app.use('/contact', contactRouter);
app.use('/admin', adminBookingRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
