/**
 * Created by wangwei on 2015/12/31.
 */
var MyExpress=require('./lib/MyExpress');
var route=MyExpress.Router();
var fs=require('fs');
route.get('/test',function(req,res){
    console.log('test............')
    res.end();
});
route.get('/test1/:name',function(req,res){
    console.log('test1............'+req.params.name)
    res.end();
});
route.get('/fs',function(req,res,next){
    fs.readFile(__dirname+'/ff',function(err,file){
        if(err){
            console.log(err)
            next(err);
        }
        console.log(file);
        res.end('okokok');
    })
})
route.post('/ajax',function(req,res,next){
    console.log('ajax..........')
    res.end('oko');
})
module.exports=route;