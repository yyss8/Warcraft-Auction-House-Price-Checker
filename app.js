const request = require('superagent');
const express = require("express");
const path = require('path');
var bodyParser = require('body-parser');
var getPrice = require("./getprice.js");

const professionsApi = require('./routes/api/professions');
const priceApi = require('./routes/api/price');

var add = require("./cp_modify/add_item.js");


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

app.get("/add",function(req,res){
    res.render(__dirname + '/add.html');
});

app.post("/addComp",function(req,res){
    console.log(req.body.field);
    var lib = db.get(req.body.field);
    add.addItem(req.body,lib,function(result){
        res.send(result);
    });
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Server Started", host, port);

});