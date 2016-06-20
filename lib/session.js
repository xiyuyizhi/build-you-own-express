/**
 * Created by wangwei on 2015/12/31.
 */
var sessions = {};
var key = 'session_id';
var EXPIRES = 1 * 60 * 1000;
function session(req,res,next){
    /*����session*/
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
         console.log('�û���һ�ε�½������session');
         next();
         return true;
         } else {*/
        var session = sessions[id];
        if (session) {
            if (session.cookie.expires > (new Date()).getTime()) {
                //����session��Чʱ��
                session.cookie.expires = (new Date()).getTime() + EXPIRES;
                req.session = session;
                console.log('����session��Чʱ��');
                next();
                return true;
            } else {
                //ɾ��session,��������
                delete sessions[id];
                req.session = generateSession();
                //res.setHeader('Set-Cookie', key + '=0'+';Max-Age=0');
                console.log('sessionʧЧ');
                res.end('�Ự��ʧЧ�������µ�½');
                return false;
            }
        }
        else {
            //���session���ڻ����ԣ���������session
            //delete sessions[id];
            //req.session = generateSession();
            //res.setHeader('Set-Cookie', key + '=0'+';Max-Age=0');
            console.log('session_id����');
            res.end('�Ự��ʧЧ,�����µ�½');
            return false;
        }
        /*}*/
    }

    function overrideWriteHead(req,res) {
        var originalWriteHead = res.writeHead;
        res.writeHead = function () {//һ��ģʽ
            if(req.session){
                res.setHeader('Set-Cookie', key + '=' + req.session.id);
                console.log('��session_id����cookie')
            }
            res.setHeader('Encoding','utf-8')
            console.log('overrideWriteHead������')
            originalWriteHead.apply(this, arguments);
        }
    }
    overrideWriteHead(req,res);
    console.log('sesionnnnnnnnnnnnnn')
    checkSession(req,res);
}

module.exports=session;