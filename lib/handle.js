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
        // ��stack������ȡ���м����ִ��
        //console.log(stack)
        var middleware = stack.shift();
        if (middleware) {
            try{
                // ����next()��������ʹ�м���ܹ�ִ�н�����ݹ�
                middleware(req, res, next);
            }catch(e){
                next(e);
            }
        }
    };

    function handleerror(err,req,res,stack){
        // ѡȡ�쳣�����м��
        console.log('handle error')
        stack = stack.filter(function (middleware) {
            return middleware.length === 4;
        });
        var next = function () {
            // ��stack������ȡ���м����ִ��
            var middleware = stack.shift();
            if (middleware) {
                // �����쳣����
                middleware(err, req, res, next);
            }
        };
        next();
    }

    // ����ִ��
    next();

}

module.exports=handle;
