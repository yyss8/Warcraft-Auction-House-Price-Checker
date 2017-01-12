const routers = require('express').Router();
const Prof_Services = require("../../services/Profs.Service"); 
const profServices = new Prof_Services.ProfServices();
const updateServices = new Prof_Services.UpdateItemServices();

const getDb = prof =>{
    const profList = ["Alchemy","Blacksmithing","Cooking","Enchanting","Engineering","First Aid","Inscription","Jewelcrafting","Leatherworking","Tailoring"];
    const dbList = ["alc_t","bks_t","cok_t","ect_t","egr_t","fsa_t","isc_t","jwc_t","ltw_t"]; 
    
    return dbList[profList.findIndex(index=>index==prof)]
}

routers.get('/',(req,res,next) =>{
    res.send("fuck you");
    next();
});

routers.get("/:prof/part/:kywrds",(req,res,next) =>{
    //return only first 8 matched results
    let dbName = getDb(req.params.prof);
    profServices.get_items_part(dbName,req.params.kywrds,result => {
        res.send(result);
        next();
    });
});

routers.get("/:prof/all/:kywrds",(req,res,next) =>{
    //return all matched results
    let dbName = getDb(req.params.prof);
    profServices.get_items_all(dbName,req.params.kywrds,result => {
        res.send(result);
        next();
    });
});

routers.get("/:prof/:item/comps",(req,res,next) => {
    let dbName = getDb(req.params.prof);
    profServices.get_comps(dbName,req.params.item,result => {
        res.send(result);
        next();
    });
});

routers.post("/:prof/:item/add",(req,res,next) => {
    res.writeHead(200, {"Content-Type": "application/json"});
    let dbName = getDb(req.params.prof);
    updateServices.create_new_item(dbName,req.body,result => {
        res.write(JSON.stringify(result));
        res.end();
        next();
    });
});

module.exports = routers;