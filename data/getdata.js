var request = require('superagent');
var http = require("http");

var agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 60000
});

function periodic_download_data(time,callback){
    getAuctionJson(function(err,data,refreshTime){
        callback("none",refreshTime,data); 
    });
    //for first time starting server

    var ms = time * 60000;
    function periodic_time_out(ms){
        setTimeout(function(){
            getAuctionJson(function(err,data,refreshTime){
                if (err === "none"){
                    callback("none",refreshTime,data); 
                    periodic_time_out(ms);
                }else{
                    console.log(err.code); //遇到错误重新加载api
                    getAuctionJson(function (err, data, rt) {
                        callback("none",rt, data);
                        periodic_time_out(ms);
                    });
                }
            });
        },ms);
    }
    periodic_time_out(ms);

}

function getAuctionJson(callback){
    request
    .get("http://auction-api-us.worldofwarcraft.com/auction-data/5301bfa3fe54bb793c685437da49ac42/auctions.json")
    .agent(agent)
    .end(function(err,res){
         if (err || !res.ok) {
            callback(err)
        }else{ 
            var time = new Date().toTimeString().split(" ");
            var refreshTime = time[0] + " " + time[2];
            callback("none",res.body,refreshTime);
        }
    });
}

module.exports = {"getAuctionJson":getAuctionJson,"periodic_download_data":periodic_download_data};
