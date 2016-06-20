/**
 * Created by wangwei on 2015/12/31.
 */
//var MyExpress=require('./MyExpress');
var url = require('url');
var session=require('./session');

function handle(req,res,stack){
    var originalStrack=stack;
    stack = stack.filter(function (middleware) {
        return middleware.length !==4;
    });
    var next = function (err) {
        if(err){
            handleerror(err,req,res,originalStrack);
        }
        // 从stack数组中取出中间件并执行
        //console.log(stack)
        var middleware = stack.shift();
        if (middleware) {
            try{
                // 传入next()函数自身，使中间件能够执行结束后递归
                middleware(req, res, next);
            }catch(e){
                next(e);
            }
        }
    };

    function handleerror(err,req,res,stack){
        // 选取异常处理中间件
        console.log('handle error')
        stack = stack.filter(function (middleware) {
            return middleware.length === 4;
        });
        var next = function () {
            // 从stack数组中取出中间件并执行
            var middleware = stack.shift();
            if (middleware) {
                // 传递异常对象
                middleware(err, req, res, next);
            }
        };
        next();
    }

    // 启动执行
    next();

}

module.exports=handle;
