const mongodb = require("mongodb")
const assert = require("assert")
const request = require("superagent");

const url = "mongodb://scitnet.com:5333/vue"

class ProfServices{
    get_items_part(dbName,kyWrds,callback){
        mongodb.connect(url, (err, db) => {
            assert.equal(null, err);
            const collection = db.collection(dbName);
            let srchObj = {}; //发送数据库query
            let queryObj = {}; //正则内容
            let queryObj2 = {item:1,icon:1}; //筛选返回数据
            const _str = new RegExp("^" + kyWrds,"i");
            const lngName = chkLanguage(kyWrds) ? "cnName":"enName"; //选择语言field

            queryObj["$regex"] = _str; //调用mongodb正则搜索
            srchObj[lngName] = queryObj; 
            queryObj2[lngName] = 1;   // 选择留下语言field
            collection.find(srchObj,{fields:queryObj2,limit:8}).toArray((err,doc)=>{ //return only top 8 matched results
                if (err){
                    callback({status:"err",content:"Error Happened"})
                }else{
                    callback({status:"ok",content:"Search Successful",result:doc});
                }
            });
        });
    }

    get_items_all(dbName,kyWrds,callback){
        mongodb.connect(url, (err, db) => {
            assert.equal(null, err);
            const collection = db.collection(dbName);
            let srchObj = {}; //发送数据库query
            let queryObj = {}; //正则内容
            let queryObj2 = {item:1,icon:1}; //筛选返回数据
            const _str = new RegExp(kyWrds,"gi");
            const lngName = chkLanguage(kyWrds) ? "cnName":"enName"; //选择语言field

            queryObj["$regex"] = _str; //调用mongodb正则搜索
            srchObj[lngName] = queryObj; 
            queryObj2[lngName] = 1;   // 选择留下语言field
            collection.find(srchObj,{fields:queryObj2}).toArray((err,doc)=>{ //return all matched results
                if (err){
                    callback({status:"err",content:"Error Happened"})
                }else{
                    callback({status:"ok",content:"Search Successful",result:doc});
                }
            });
        });
    }

    get_comps(dbName,item,callback){
        mongodb.connect(url, (err, db) => {
            assert.equal(null, err);
            const collection = db.collection(dbName);
            collection.findOne({"item":Number(item)},{fields:{comp:1}}).then((doc)=>{
                if (err){
                    callback({status:"err",content:"Error Happened"})
                }else{
                    callback({status:"ok",content:"Search Successful",result:doc});
                } 
            });
        });
    }

}

function chkLanguage(s){  
    //检查是否中文
    let patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;  
    if(!patrn.exec(s)){  
        return false;  
    }else{  
        return true;  
    }  
}

class UpdateItemServices{
    create_new_item(dbName,itemPkg,callback){
        let hasError = false; //prevent multiple callback after error happened
        let itemToUpdate = {"item":Number(itemPkg.main),"quantity":Number(itemPkg.quantity),"cnName":"","enName":"","icon":"","comp":[]};
        getItemInfo(itemPkg.main,0,returnData => { //get item information
            if (returnData != "none"){
                itemToUpdate.enName = returnData.name;
                itemToUpdate.icon = returnData.icon;
                if (itemPkg.comps.length != 0){
                    //get item info for item comps
                    for (var i = 0;i< itemPkg.comps.length;i++){
                        var finishCounter = 0;
                        var compObj = {"compItem":Number(itemPkg.comps[i].comp),"icon":"","isAuctionable":false,"enName":"",quantity:Number(itemPkg.comps[i].quantity)};
                        itemToUpdate.comp.push(compObj);
                        getItemInfo(itemPkg.comps[i].comp,i,(returnData) => {
                            //save item comps by order
                            itemToUpdate.comp[returnData.index].icon = returnData.icon;
                            itemToUpdate.comp[returnData.index].enName = returnData.name;
                            itemToUpdate.comp[returnData.index].isAuctionable = returnData.isAuctionable;
                            finishCounter +=1;
                            if (finishCounter == (Object.keys(itemPkg.comps).length)){
                                //wait until item comps are loaded
                                mongodb.connect(url, (err, db) => {
                                    assert.equal(null, err);
                                    let collection = db.collection(dbName);
                                    collection.insertOne(itemToUpdate).then((doc)=>{
                                        callback({"status":"ok","content":`Item Number:${itemPkg.main} Added.`}); 
                                    },(err)=>{
                                        callback({"status":"err","content":errorCodes[err.code]});
                                    });
                                    db.close();
                                });
                            }
                        },err=>{
                            if (!hasError){
                                callback({"status":"err","content":err.err,item:err.item});
                                hasError = true;
                            }
                        });
                    }
                }
            }else{
                callback({"status":"err","content":"Main Item Not Found",item:"main"});
            }

        },err=>{
            callback({"status":"err","content":"Main Item Icon Not Found",item:"main"})
        }); 
    }
}

function getItemInfo(id,index,callback,error){

    returnData = {};
    let url = `https://us.api.battle.net/wow/item/${id}?locale=en_US&apikey=kjp5c67kqfvk4uukkzaafa8cw8bvfzw3`;
    request
    .get(url)
    .end((err,res) => {
         if (err || !res.ok) {
            error({item:id,err:error});
        }else{ 
            returnData.index = index; //get comp index
            returnData.icon = res.body.icon;
            returnData.isAuctionable = res.body.isAuctionable;
            returnData.name = res.body.name
            callback(returnData);
        }
    });
}

module.exports = {"ProfServices":ProfServices,"UpdateItemServices":UpdateItemServices};