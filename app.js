const createError = require('http-errors');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
// const sessionStore = require('session-file-store')(session);
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const boardRouter = require('./routes/board');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.locals.pretty = true;
app.locals.titleDef = "게시판";
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// session - redis
const redisConfig = {
	"host": "localhost",
	"port": 6379,
	"prefix": "session:",
	"db": 0,
	"client": redis.createClient(6379, "localhost")
};
app.use(session({
  secret: process.env.salt,
  resave: false,
  saveUninitialized: true,
  store: new redisStore(redisConfig)
}));


app.use(methodOverride((req, res) => {
	if (req.body && typeof req.body === 'object' && '_method' in req.body) {
		// look in urlencoded POST bodies and delete it
		let method = req.body._method;
		delete req.body._method;
		return method;
	}
}));


app.use("/", express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));

// /user* 를 제외한 모든 접근을 허용하는 미들웨어
app.use(/^(?!\/user).+/, (req, res, next) => {
	console.log("BASE: ", req.baseUrl);
	if(req.session.userid) next();
	else res.redirect('/user/login');
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/board', boardRouter);

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
