const calPrice = require("../data/calprice.js");

class PriceService{

    get_items_price(item,callback){
        let jsonComp = JSON.parse(item.comps); //convert json
        let resultData = {item:item.item,price:0,comps:[]};
        jsonComp.forEach(comp => {
            calPrice.itemPrice(comp,result => {
                if (typeof result === "object"){
                    resultData.comps.push(result);
                    resultData["price"] += result.num; //get total price for main item

                    if (resultData.comps.length == jsonComp.length){
                        callback(resultData); 
                    }
                }
            });
        });
    }
}

module.exports = {"PriceService":PriceService}