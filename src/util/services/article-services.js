/*
* @Author: chen
* @Date:   2018/4/18
*/
'use strict';
var util = require('util/util.js');
var serverHost = require('globalUrl');

var _article = {
    saveArticle: function (data, resolve, reject) {
        var _this = this;
        util.request({
            url             : _this.getServerUrl('/article/save') + "?t=" + new Date().getTime(),
            type            : 'post',
            data            : data,
            dataType        : "json",
            success         : resolve,
            error           : reject
        });
    },
    editArticle: function (data, resolve, reject) {
        var _this = this;
        util.request({
            url             : _this.getServerUrl('/article/edit') + "?t=" + new Date().getTime(),
            type            : 'post',
            data            : data,
            dataType        : "json",
            success         : resolve,
            error           : reject
        });
    },
    getArticle: function (id, resolve, reject) {
        var _this = this;
        util.request({
            url             : _this.getServerUrl('/article/get') + "?t=" + new Date().getTime(),
            type            : 'get',
            data            : id,
            success         : resolve,
            error           : reject
        });
    },
    getList: function (page, resolve, reject) {
        var _this = this;
        util.request({
            url             : _this.getServerUrl('/article/list') + "?t=" + new Date().getTime(),
            type            : 'post',
            data            : page,
            success         : resolve,
            error           : reject
        });
    },
    // 获取服务器地址
    getServerUrl: function (path) {
        return serverHost + path;
    }
};
module.exports = _article;