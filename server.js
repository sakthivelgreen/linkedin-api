require('dotenv').config();
const LinkedInRouter = require('./routes/linkedinRouter');

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/linkedin', LinkedInRouter);

app.get('/', function (req, res) {
    res.redirect('/app');
});

app.listen(port, () => {
    console.log(`Server at http://localhost:${port}`)
})
module.exports = app;




