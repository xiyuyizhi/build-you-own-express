/**
 * Created by wangwei on 2015/12/30.
 */
var http = require('http');
var path=require('path')
var MyExpress = require('./lib/MyExpress');
var testRoute = require('./testRoute');
var parsecookie = require('./lib/parseCookie');
var parsebody = require('./lib/parsebody');
var session = require('./lib/session');
var app = MyExpress.getInstance();
app.use(parsecookie);
app.use(parsebody);
//app.use(session);
app.use(MyExpress.static(path.join(__dirname, 'public')))
app.use('/users', function (req, res,next) {
    console.log('users..............')
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.write('users')
    res.end();
});
app.use('/users/:username/:age', function (req, res) {
    console.log('username ' + req.params['username']);
    console.log('age ' + req.params['age'])
    res.end();
});
//不能匹配静态文件，路由 则为404
app.use(function(error,req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
})
//异常处理
app.use(function (error, req, res, next) {
    console.log(error)
    res.writeHead(error.status||500);
    res.end(error.message);
})


http.createServer(app).listen(800);
console.log('server start at port 800')