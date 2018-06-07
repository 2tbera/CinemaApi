const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cinema',function (err , db){
 console.log("Error : "+ err);
});


// routs
const cinema = require('./api/routes/cinema');
const hall = require('./api/routes/hall');
const show = require('./api/routes/show');
const movie = require('./api/routes/movie');
// routs END


app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);

    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET ');
        return res.status(200).json({});
    }
    next();
});


app.use('/uploads', express.static('uploads'));
app.use('/video', express.static('video'));

// routs links
app.use('/cinema', cinema);
app.use('/movie', movie);
app.use('/hall', hall);
app.use('/show', show);

// routs links END

// ERRORS
app.use((req, res, next) => {
    const error = new Error('Not found 404');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});
// ERRORS


module.exports = app;

