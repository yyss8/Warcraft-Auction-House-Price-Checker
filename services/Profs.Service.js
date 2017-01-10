const mongodb = require("mongodb")
const assert = require("assert")

const url = "mongodb://scitnet.com:5333/vue"

function chkLanguage(s){  
    //检查是否中文
    let patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi;  
    if(!patrn.exec(s)){  
        return false;  
    }else{  
        return true;  
    }  
}

class ProfServices{
    get_items_all(dbName,kyWrds,callback){
        mongodb.connect(url, (err, db) => {
            assert.equal(null, err);
            const collection = db.collection(dbName);
            let srchObj = {}; //发送数据库query
            let queryObj = {}; //正则内容
            let queryObj2 = {item:1,icon:1}; //筛选返回数据
            let _str = new RegExp("^" + kyWrds,"i");
            let lngName = chkLanguage(kyWrds) ? "cnName":"enName"; //选择语言field

            queryObj["$regex"] = _str; //调用mongodb正则搜索
            srchObj[lngName] = queryObj; 
            queryObj2[lngName] = 1;   // 选择留下语言field
            collection.find(srchObj,{fields:queryObj2,limit:8}).toArray((err,doc)=>{
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

module.exports = {"ProfServices":ProfServices};