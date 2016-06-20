/**
 * Created by wangwei on 2015/12/31.
 */
var fs = require('fs');
var queryString = require('querystring');
var url = require('url');
var parseCookie = require('./parseCookie');
var handle = require('./handle');
var pathRegexp = require('./pathRegexp');
//var parsebody=require('./parsebody');


var hasBody = function (req) {
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
};
function mime(req) {
    //multipart/form-data
    // application/json
    // application/x-www-form-urlencoded
    return req.headers['content-type'] ? req.headers['content-type'].split(';')[0] : '';
}

var App = {
    routes: {'all': []},
    Router: function () {
        var tt = {};
        var _this = this;
        ['get', 'post', 'put', 'delete'].forEach(function (method) {
            _this.routes[method] = [];
            tt[method] = function (path, action) {
                var handle = {};
                handle.path = pathRegexp(path);
                handle.stack = Array.prototype.slice.call(arguments, 1);
                _this.routes[method].push(handle);
            };
        });
        return tt;
    },
    match: function (req, res, routes) {
        var pathname = url.parse(req.url).pathname;
        //console.log('pathname ' + pathname)
        var stacks = [];
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            //console.log(route)
            // 正则匹配
            var reg = route.path.regexp;
            var keys = route.path.keys;
            var matched = reg.exec(pathname);
            //console.log('keys ' + keys);
            //console.log('matched ' + matched)
            if (reg.exec('/') || matched) {
                // 抽取具体值
                var params = {};
                for (var key = 0, l = keys.length; key < l; key++) {
                    var value = matched[key + 1];
                    if (value) {
                        console.log(keys[key])
                        params[keys[key]] = value;
                    }
                }
                req.params = params;
                stacks = stacks.concat(route.stack);
            }
        }
        // 将中间件都保存起来
        return stacks;
    },
    getInstance: function () {
        var _this = this;
        function Cb(req, res) {
            if (req.url !== '/favicon.ico') {
                var pathname = url.parse(req.url).pathname;
                var method = req.method.toLowerCase();
                //parseCookie(req);
                console.log( _this.routes.all)
                var stacks = _this.match(req, res, _this.routes.all);
                stacks = stacks.concat(_this.match(req, res, _this.routes[method]));
                //parsebody(req,res);
                console.log('strack.........')
                console.log(stacks)
                //_this.parsebody(req,res,stacks);
                console.log('pppppppppppp')
                handle(req, res, stacks)
            } else {
                res.end();
            }
        }

        Cb.use = function (path, fn) {
            var handle = {};
            if (typeof path == 'string') {
                handle.path = pathRegexp(path);
                handle.stack = Array.prototype.slice.call(arguments, 1);
            } else {
                handle.path = pathRegexp('/');
                handle.stack = Array.prototype.slice.call(arguments, 0);
            }
            _this.routes['all'].push(handle);
        }
        return Cb;
    },
    static: function (_root) {
        return function staticFile(req,res,next){
            var pathname = url.parse(req.url).pathname;
            console.log('static中的session')
            console.log(req.session)
            console.log(_root+pathname)
            fs.readFile(_root+ pathname, 'utf-8', function (error, text) {
                if(error){
                    next();
                    return false;
                }
                res.writeHead(200);
                res.end(text);
            });
        }
    }

};
module.exports = App;