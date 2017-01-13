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
        
        price.num = Math.floor(tempPrice / tempQuantity); //get price for single comp item
        price.num= price.num * comp.quantity; //get price for required number of comp item of main item

        callback(price);
    }
}

function setLib(lib){
    auctionLib = lib.auctions;
}

module.exports = {"itemPrice":itemPrice,"setLib":setLib};