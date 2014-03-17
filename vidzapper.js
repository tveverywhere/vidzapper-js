var crypto = require('crypto'),
    request = require('request'),
    util = require('util'),
    moment = require('moment');

var VidZapperApi = function(opt) {
    var _parseUrl = function(url, params) {
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
    this.api = function(url, params, callback) {

        var method = "POST";

        if (typeof params === 'function') {
            callback = params;
            params = null;
            method = "GET";
        }

        var options = { method: method, json: {}, rejectUnauthorized: false };

        if (method == 'POST') {
            options.json = params;
            url = _parseUrl(url);
        } else {
            url = _parseUrl(url, params);
        }

        url = opt.server + url;

        var req = request(url, options, function(error, response, body) {
            if (response === null || response === undefined) {
                callback({ error: true, message: "VidZapper.Api.Error: Request failed without a response. Network Connected? ", more: error, body: body, response: response });
            } else if (!error && (response.statusCode >= 200 && response.statusCode < 300)) {
                callback(body);
            } else if (!error && response.statusCode == 404) {
                callback({ error: true, code: response.statusCode, message: "Api method not found", url: url });
            } else {
                callback({ error: true, code: response.statusCode, message: body, url: url });
            }
        });

        //console.log("request", req);

        req.on('socket', function(socket) {
            //console.log("socket", socket);
        });

        req.on('error', function(err) {
            console.log("error", err);
        });

        //req.end();
    };
};
module.exports=VidZapperApi;
