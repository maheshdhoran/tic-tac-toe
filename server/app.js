const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const app = express();
const apiRoutes = require(`./routes/apiRoutes`);
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

//Rate Limiter
const limiter = rateLimit({
    max: 60,
    windowMs: 1 * 60 * 1000,
    message: (req, res) => {
        return res.status(429).json({
            status: 'fail',
            errorCode: 'ERR_RATE_LIMIT',
            message: 'Too many requests from this IP, please try again after a minute'
        });
	},
});

app.use('/api', limiter);

//logging
app.use(morgan('dev'));

//security middlewares
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(mongoSanitize());
app.use(xss());

//body parsing middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Routes
app.use('/api', apiRoutes);

//Url not found
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404, 'ERR_NOT_FOUND'));
});

//Global Error handler
app.use(globalErrorHandler);

//Export
module.exports = app;