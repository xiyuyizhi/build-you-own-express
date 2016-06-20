/**
 * Created by wangwei on 2015/12/31.
 */
/*½âÎöcookie*/
function parseCookie(req,res,next) {
    var cookies = req.headers.cookie,
        cooks = {};
    if (!cookies) {
        req.cookies = cooks;
        next();
        return;
    }
    for (var i = 0, cookieArr = cookies.split(';'); i < cookieArr.length; i++) {
        cooks[cookieArr[i].split('=')[0].trim()] = cookieArr[i].split('=')[1];
    }
    req.cookies = cooks;
    console.log('vvvvvvvvvvvvvvvvvv');
    next();
}
module.exports=parseCookie;