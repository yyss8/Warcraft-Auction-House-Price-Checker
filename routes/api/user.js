const services = require('../../services/User.Service');
const routers = require('express').Router();
const userSrv = new services.UserService();


routers.get('/',(req,res,next) =>{
    res.send("user main");
    next();
});

routers.get('/loginStatus',(req,res,next) =>{
    if (req.session.auth){
        res.send({'status':'ok',user:req.session.user});
        next();
    }else{
        res.send({'status':'none'});
        next();
    }
});

routers.get('/login',(req,res,next) => {
    userSrv.user_auth(req.query.username,req.query.password,(result) =>{
        if (result.status == "ok"){
            req.session.regenerate(() => {
                req.session.auth = true;
                req.session.user = req.query.username;
                result['user'] = req.session.user;
                res.send(result);
             });
        }else{
            res.send(result);
            next();
        }
    });
});

routers.get('/logout',(req,res,next) => {
    req.session.destroy(() => {
        res.redirect('../');
        next();
    });
});

routers.get('/data/:username',(req,res,next) => {
    userSrv.get_user_info(req.params.username,result => {
        res.send(result);
        next();
    });
});

routers.put('/:username/edit',(req,res,next) => {
    userSrv.change_user_info(req.body,result => {
        res.send(result);
        next();
    });
});


module.exports = routers;