const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');

const professionsApi = require('./routes/api/professions');
const priceApi = require('./routes/api/price');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/api/professions',professionsApi);
app.use('/api/price',priceApi);

app.get('/',(req,res,next) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  next();
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Server Started", host, port);

});