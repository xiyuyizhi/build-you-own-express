/**
 * Created by wangwei on 2015/12/31.
 */
var sessions = {};
var key = 'session_id';
var EXPIRES = 1 * 60 * 1000;
function session(req,res,next){
    /*生成session*/
    function generateSession() {
        var session = {};
        session.id = (new Date()).getTime() + Math.random();
        session.cookie = {
            expires: (new Date()).getTime() + EXPIRES
        }
        sessions[session.id] = session;
        console.log('sessions:'+sessions)
        return session;
    }

    function checkSession(req, res) {
        console.log('cookies')
        console.log(req.cookies)
        var id = req.cookies[key];
        console.log(sessions);
        console.log('id.........')
        console.log(id)
        /*if (!id) {
         req.session = generateSession();
         console.log('用户第一次登陆，创建session');
         next();
         return true;
         } else {*/
        var session = sessions[id];
        if (session) {
            if (session.cookie.expires > (new Date()).getTime()) {
                //更新session有效时间
                session.cookie.expires = (new Date()).getTime() + EXPIRES;
                req.session = session;
                console.log('更新session有效时间');
                next();
                return true;
            } else {
                //删除session,重新生成
                delete sessions[id];
                req.session = generateSession();
                //res.setHeader('Set-Cookie', key + '=0'+';Max-Age=0');
                console.log('session失效');
                res.end('会话已失效，请重新登陆');
                return false;
            }
        }
        else {
            //如果session过期或口令不对，重新生成session
            //delete sessions[id];
            //req.session = generateSession();
            //res.setHeader('Set-Cookie', key + '=0'+';Max-Age=0');
            console.log('session_id不对');
            res.end('会话已失效,请重新登陆');
            return false;
        }
        /*}*/
    }

    function overrideWriteHead(req,res) {
        var originalWriteHead = res.writeHead;
        res.writeHead = function () {//一种模式
            if(req.session){
                res.setHeader('Set-Cookie', key + '=' + req.session.id);
                console.log('将session_id放入cookie')
            }
            res.setHeader('Encoding','utf-8')
            console.log('overrideWriteHead被调用')
            originalWriteHead.apply(this, arguments);
        }
    }
    overrideWriteHead(req,res);
    console.log('sesionnnnnnnnnnnnnn')
    checkSession(req,res);
}

module.exports=session;