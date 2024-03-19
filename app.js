const express = require('express');
const moragn = require('morgan');
const createError = require('http-errors');
const v1 = require('./v1/v1');
const app = express();
app.use(express.json());
app.use(moragn('dev'));

// Access-Control-Allow-Origin
//Access-Control-Allow-Methods
//Access-Control-Allow-Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//version 1
app.use('/v1', v1);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use(async(err, req, res, next) => { 
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    });
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
