const routers = require('express').Router();
const Price_Services = require('../../services/Price.Service');
const priceServices = new Price_Services.PriceService();
const getData = require("../../data/getdata");
const setLib = require("../../data/calprice").setLib;

let libUpdateTime = "None";

getData.periodic_download_data(20,function(err,t,d){
    //download data for each 20 mins
    if (err ==="none"){
        libUpdateTime = t;
        setLib(d);
        console.log("Updated Time: " + libUpdateTime);
    }
});

routers.get('/',(req,res,next) =>{
    res.send("price main");
    next();
});

routers.get("/:item/all/:comps",(req,res,next) => {
    priceServices.get_items_price(req.params,result=>{
        res.send(result);
        next();
    });
   
});

routers.get("/time",(req,res,next) => {
    res.send(libUpdateTime);
    next();
});
module.exports = routers;
