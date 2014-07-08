var crypto = require('crypto'),
    request = require('request'),
    moment = require('moment');
var VidZapperApi = function (opt) {
    var _parseUrl = function (url, params) {
        if (!params) {
            params = "";
        } else {
            params = "?" + params;
        }
        var appKey = JSON.stringify({
            ValidTill: moment.utc().format("YYYYMMDDHHmm"),
            Parameters: params,
            Key: opt.id,
            Method: url
        });
        var tmpKey = crypto.createHmac('sha1', opt.secret).update(appKey, 'utf8').digest('hex');
        var tmp = opt.secret.substring(0, opt.secret.indexOf('r') + 1) + tmpKey + '/' + url;
        return tmp + params;
    };
    
    VidZapperApi.prototype.init = function(cfg) {
        opt=cfg;
    };
    VidZapperApi.prototype.get = function(url,params,callback) {
      return _apicore(url,params,'GET',callback);         
    };
    VidZapperApi.prototype.api = function(url,params,callback) {
      return _apicore(url,params,'POST',callback);         
    };
    VidZapperApi.prototype.post = function(url,params,callback) {
      return _apicore(url,params,'POST',callback);         
    };
    VidZapperApi.prototype.get2 = function(url,params,callback) {
      return _apicore(url,params,'GET',callback,'v2');         
    };
    VidZapperApi.prototype.api2 = function(url,params,callback) {
      return _apicore(url,params,'POST',callback,'v2');         
    };
    VidZapperApi.prototype.post2 = function(url,params,callback) {
      return _apicore(url,params,'POST',callback,'v2');         
    };

    var _apicore= function (url, params,method, callback,v) {

        if (typeof params === 'function') {
            callback = params;
            params = null;
            method = "GET";
        }

        var headers = {
            'user-agent': 'VidZapper Api Node JS/0.0.1',
            'content-type': 'application/json; charset=utf-8',
            //'accept-encoding':'gzip,deflate'
        }

        var options = {
            method: method,
            json: {},
            header:headers,
            rejectUnauthorized: false
        };


        var fName=opt.server + (v==='v2'?'v2/my/':'my/') + url+(method == 'GET'?'?'+params:'');

        if (method == 'POST') {
            options.json = params;
            url = _parseUrl(url);
        } else {
            url = _parseUrl(url, params);
        }

        url = opt.server + url;
        options.url=url;
        if(!!opt.debug){
            console.log('connecting',fName);
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
};
exports = module.exports = function(args) {
  return new VidZapperApi(args);
};
