var crypto = require('crypto'),
    request = require('request'),
    moment = require('moment');
var VidZapperApi = function (opt) {

    var _noop=function(){}

    var _parseUrl = function (url,params) {
        if (!params) {
            params = "";
        } else {
            params = "?" + params;
        }
        if(opt.authorization) return 'my/'+url + params;

        var appKey = JSON.stringify({
            ValidTill: moment.utc().format("YYYYMMDDHHmm"),
            Parameters: params,
            Key: opt.id,
            Method: url
        });
        
        var tmp =  opt.secret.substring(0, opt.secret.indexOf('r') + 1) + crypto.createHmac('sha1', opt.secret).update(appKey, 'utf8').digest('hex') + '/' + url;

        return tmp + params;
    };
    
    var _apicore= function (url, params,method, callback,v) {
        
        if (typeof params === 'function') {
            callback = params;
            params = null;
            method = "GET";
        }

        callback=callback || _noop;

        var headers = {
            'user-agent': 'VidZapper Api Node JS/0.0.1',
            'content-type': 'application/json; charset=utf-8'
        }
        if(opt.authorization){
            headers.authorization=opt.authorization;
        }

        var options = {
            method: method,
            json: {},
            headers:headers,
            rejectUnauthorized: false
        };


        var fName=opt.server + (v==='v2'?'v2/my/':'my/') + url+(method == 'GET' && !!params?'?'+params:'');

        if (method == 'POST'|| method=='PUT') {
            options.json = params;
            url = _parseUrl(url);
        } else {
            url = _parseUrl(url, params);
        }

        url = opt.server +(v==='v2'?'v2/':'')+  url;
        options.url=url;

        if(opt.debug && url.indexOf('que/progress')>-1){
            console.log('connecting-live',url);
            console.log('Data',options.json);
        }

        request(options,function(error,response,body){
            if (response === null || response === undefined) {
                callback({
                    error: true,
                    message: "VidZapper.Api.Error: Request failed without a response. Network Connected? ",
                    more: error,
                    body: body,
                    response: response
                });
            } else if (!error && (response.statusCode >= 200 && response.statusCode < 300)) {
                callback(body);
            } else if (!error && response.statusCode == 404) {
                callback({
                    error: true,
                    code: response.statusCode,
                    message: "Api method not found ("+fName+")",
                    url: url
                });
            } else {
                callback({
                    error: true,
                    code: response.statusCode,
                    message: body,
                    url: url
                });
            }
        });
    };

    return  {
        init:function(cfg) {  opt=cfg; },
        get:function(url,params,callback) { return _apicore(url,params,'GET',callback);},
        api:function(url,params,callback) { return _apicore(url,params,'POST',callback);},
        post:function(url,params,callback) { return _apicore(url,params,'POST',callback);},
        get2:function(url,params,callback) { return _apicore(url,params,'GET',callback,'v2');},
        api2:function(url,params,callback) { return _apicore(url,params,'POST',callback,'v2');},
        post2:function(url,params,callback) { return _apicore(url,params,'POST',callback,'v2');},
        put:function(url,params,callback) { return _apicore(url,params,'PUT',callback);},
        put2:function(url,params,callback) { return _apicore(url,params,'PUT',callback,'v2');},
        delete:function(url,params,callback) { return _apicore(url,params,'DELETE',callback); },
        delete2:function(url,params,callback) { return _apicore(url,params,'DELETE',callback,'v2');}
    };
};
exports = module.exports = function(args) {
  return new VidZapperApi(args);
};
