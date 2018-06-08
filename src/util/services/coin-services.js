/*
* @Author: chen
* @Date:   2018/4/13
*/
'use strict';

var util = require('util/util.js');
var serverHost = '';
var _coins = {

    getCoinList : function (resolve,reject) {
        var _this = this;
        serverHost = 'http://www.91pool.com/api';
        util.request({
            url     : _this.getServerUrl('/pool/stats'),
            type  : 'get',
            success : resolve,
            error   : reject
        });
    },
    getCoins : function(type,resolve,reject){
        var _this = this;
        serverHost = 'http://www.91pool.com/api';
        util.request({
            url     : _this.getServerUrl('/'+type+'/stats'),
            type  : 'get',
            success : resolve,
            error   : reject
        });
    },
    getBlocks : function(type,resolve,reject){
        var _this = this;
        serverHost = 'http://www.91pool.com/api';
        util.request({
            url     : _this.getServerUrl('/'+type+'/blocks'),
            type  : 'get',
            success : resolve,
            error   : reject
        });
    },
    getPrice : function (type,resolve) {
        var _this = this;
        serverHost = 'http://api.guower.com';
        util.getJsonp({
            url     : _this.getServerUrl('/coin/markets/'+type),
            callback: resolve
        })
    },
    getLCH : function (resolve,reject) {
        var _this = this;
        serverHost = 'https://block.cc/api/v1/query?str=lch&act=q';
        util.request({
            url     : serverHost,
            type  : 'get',
            success : resolve,
            error   : reject
        });
    },
    // 获取服务器地址
    getServerUrl : function(path){
        return serverHost + path;
    }
};
module.exports = _coins;