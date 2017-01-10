const cf = require("crossfilter");

let auctionLib = "";

function itemPrice(comp,callback){

    if(auctionLib != ""){

        let tempPrice,tempQuantity;

        auctionLib.forEach(r=>{
            if (r.item == comp.comp && r.buyout != 0){
                if (tempPrice == undefined || r.buyout < tempPrice){
                    tempPrice = r.buyout;
                    tempQuantity = r.quantity;
                }
            }
        });

        let price = {"comp":comp.comp,"num":0};
        
        price.num = tempPrice / tempQuantity; //get price for single comp item
        price.num= price.num * comp.quantity; //get price for required number of comp item of main item
        
        let lowestPrice = price.num.toString();
        let gold = (lowestPrice.slice(0,lowestPrice.length-4) == "" || isNaN(Number(lowestPrice.slice(0,lowestPrice.length-4)))) ? 0:lowestPrice.slice(0,lowestPrice.length-4);
        let silver = (lowestPrice.slice(lowestPrice.length-4,lowestPrice.length-2) == "" || isNaN(Number(lowestPrice.slice(lowestPrice.length-4,lowestPrice.length-2)))) ? 0:lowestPrice.slice(lowestPrice.length-4,lowestPrice.length-2);
        let copper = (lowestPrice.slice(lowestPrice.length-2) == "" || isNaN(Number(lowestPrice.slice(lowestPrice.length-2)))) ? 0:lowestPrice.slice(lowestPrice.length-2);
        price.text = gold.toString() + "g" + silver.toString() + "s" + copper.toString() + "c";

        callback(price);
    }
}

function setLib(lib){
    auctionLib = lib.auctions;
}

module.exports = {"itemPrice":itemPrice,"setLib":setLib};