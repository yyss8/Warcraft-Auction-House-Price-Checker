const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const user = require('./routes/api/user');
const professionsApi = require('./routes/api/professions');
const priceApi = require('./routes/api/price');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret:'wowscit',
  cookie:{ maxAge:60*60*1000*24 },
  resave:false,
  saveUninitialized:false
}));

app.use('/api/professions',professionsApi);
app.use('/api/price',priceApi);
app.use('/user',user);


app.get('/',(req,res,next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/cp',(req,res,next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/cp/*',(req,res,next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Server Started", host, port);

});