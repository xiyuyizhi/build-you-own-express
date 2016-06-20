/**
 * Created by wangwei on 2015/12/31.
 */
var handle = require('./handle');

var hasBody = function (req) {
    return 'transfer-encoding' in req.headers || 'content-length' in req.headers;
};
function mime(req) {
    //multipart/form-data
    // application/json
    // application/x-www-form-urlencoded
    return req.headers['content-type'] ? req.headers['content-type'].split(';')[0] : '';
}
function parsebody(req, res, next) {
    //var _this=this;
    if (hasBody(req)) {//post之类的请求
        if (mime(req) == 'multipart/form-data') {
            var form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.uploadDir = "upload";
            form.keepExtensions = true;
            form.parse(req, function (err, fields, files) {
                console.log(fields);
                console.log(files)
                res.end('ok');
            });
            return false;
        }

        var buffers = [];
        req.on('data', function (chunk) {
            buffers.push(chunk);
        });
        req.on('end', function () {
            req.bodyStr = Buffer.concat(buffers).toString();
            console.log(req.bodyStr)
            if (mime(req) === 'application/json') {
                try {
                    req.body = JSON.parse(req.bodyStr);
                    console.log('json')
                    console.log(req.body)
                    next()
                } catch (e) {
                    // 异常内容，响应Bad request
                    res.writeHead(400);
                    res.end('Invalid JSON');
                    return false;
                }
            } else {
                req.body = queryString.parse(req.bodyStr);
                console.log(req.body)
                next()
            }
        });
    }
    else {//get 之类的请求
        next()
    }
}
module.exports = parsebody;