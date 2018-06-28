/*
* @Author: chen
* @Date:   2018/4/10
*/
'use strict';

require('./index.css');
require('common/header/index.js');
require('common/footer/index.js');
var util = require('util/util.js');
var mwx = require('util/wx.js');
var _reset = require('util/reset.js');
var _coins = require('util/services/coin-services.js');
var $ = require('jQuery');
var lang = localStorage.lang;
var coin = util.getUrlParam('coin');
var upper = coin.toUpperCase();
var json = require('util/languages/' + lang + '.json');
var teach = require('teach/' + coin + '_teach.string');
var xTime = ['now'],
    yData = [0];
var btmFlag = true;

var index = {
    init: function () {
        this.setwx();
        this.setBaidu();
        this.default();
        this.setData();
        this.handler();
        this.setIndex();
    },
    handler: function () {
        if(coin == 'lch'){
            return
        }
        var _this = this;
        $(document).on('click', '#search', function () {
            var val = $.trim($("#address").val());
            var continued = util.validate(val,'require');
            if(continued){
                window.location.href = './worker.html?coin=' + coin + '&wallet='+ val;
            }
        });
        // 币种导航
        $(document).on('click', '.coin-title>li', function (e) {

            var i = $(this).index();
            var page = $(this).attr("page");
            $(this).addClass('active').siblings().removeClass('active');
            $(".tab").hide().eq(i).show();

            if(coin == 'btm'){
                if( page == 'teach'){
                    if (btmFlag) {
                        $('.btmType').fadeIn();
                        btmFlag = false;
                    } else {
                        btmFlag = true;
                        $('.btmType').fadeOut();
                    }
                    e.stopPropagation();
                }
            }
        });

        $(document).on('click', '.btmType li', function () {
            var myIndex = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $(".btmTab").addClass("hidden").eq(myIndex).removeClass("hidden");
        });

        $(document).on('click', function (e) {
            btmFlag = true;
            $('.btmType').fadeOut();
        });

        $(document).on('click', '.work-title li', function () {
            if ($(this).hasClass('active')) {
                return false;
            }
            var i = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.f-tab').hide().eq(i).show();
        });

        $('.teach').on('click', 'img', function () {
            var wh = $(window).width();
            if(wh > 700){
                return
            }

        })
    },
    setData: function () {
        if(coin == 'lch'){
            return
        }
        _coins.getBlocks(coin, function (data) {
            if (data.luck == null) {
                $('#get-box').hide();
            } else {
                $("#lucky").html(_reset.num2per(data.luck[100].luck));
                $.each(data.luck, function (i, t) {
                    t.orphanRate = _reset.num2per(t.orphanRate);
                    t.luck = _reset.num2per(t.luck);
                    t.uncleRate = _reset.num2per(t.uncleRate);
                    t.number = i;
                });
                var luckList = {
                    list: data.luck
                };
                var luckHtml = template('luckList-tp', luckList);
                $('#luckList').html(luckHtml);
            }

            $(".maturedTotal-small").html(_reset.formatNumber(data.maturedTotal));
            $(".immatureTotal-small").html(_reset.formatNumber(data.immatureTotal));
            $(".candidatesTotal-small").html(_reset.formatNumber(data.candidatesTotal));
            $(".maturedTotal").html(data.maturedTotal);
            $(".immatureTotal").html(data.immatureTotal);
            $(".candidatesTotal").html(data.candidatesTotal);

            if (data.matured != null) {
                $.each(data.matured, function (i, t) {
                    switch (coin) {
                        case 'etc':
                            t.myUrl = "https://gastracker.io/block/";
                            t.reward = (t.reward * 1e-18).toFixed(6);
                            break;
                        case 'etf':
                            t.myUrl = "#";
                            t.reward = (t.reward * 1e-18).toFixed(6);
                            break;
                        case 'hsr':
                            t.myUrl = "http://explorer.h.cash/block/";
                            break;
                        case 'lch':
                            t.myUrl = "http://explorer.litecoincash.tech/block/";
                            t.reward = (t.mint).toFixed(6);
                            break;
                        case 'btm':
                            t.myUrl = "http://blockmeta.com/block/";
                            t.reward = (t.reward).toFixed(6);
                            break;
                    }
                    t.timestamp = _reset.formatDateLocale(t.timestamp);
                    t.diff = _reset.getRoundVariance(t.shares, t.difficulty);
                    t.coin = coin;
                    t.dw = upper;
                });
                var dataList1 = {
                    list: data.matured
                };
                var html1 = template('block-one-tp', dataList1);
                $('#block-one').html(html1);
            }

            if (data.immature != null) {
                $.each(data.immature, function (i, t) {
                    switch (coin) {
                        case 'etc':
                            t.myUrl = "https://gastracker.io/block/";
                            t.reward = (t.reward * 1e-18).toFixed(6);
                            break;
                        // case 'eth':
                        case 'etf':
                            t.myUrl = "#";
                            t.reward = (t.reward * 1e-18).toFixed(6);
                            break;
                        case 'hsr':
                            t.myUrl = "http://explorer.h.cash/block/";
                            break;
                        case 'lch':
                            t.myUrl = "http://explorer.litecoincash.tech/block/";
                            t.reward = (t.mint).toFixed(6);
                            break;
                        case 'btm':
                            t.myUrl = "http://blockmeta.com/block/";
                            t.reward = (t.mint).toFixed(6);
                            break;
                    }
                    t.timestamp = _reset.formatDateLocale(t.timestamp);
                    t.diff = _reset.getRoundVariance(t.shares, t.difficulty);
                    t.coin = coin;
                    t.dw = upper;
                });
                var dataList2 = {
                    list: data.immature
                };
                var html2 = template('block-two-tp', dataList2);
                $('#block-two').html(html2);
            }
            if (data.candidates != null) {
                $.each(data.candidates, function (i, t) {
                    t.timestamp = _reset.formatDateLocale(t.timestamp);
                    t.diff = _reset.getRoundVariance(t.shares, t.difficulty);
                    t.coin = coin;
                    switch (coin) {
                        case 'etc':
                            t.myUrl = "https://gastracker.io/block/";
                            break;
                        case 'etf':
                            t.myUrl = "#";
                            break;
                        case 'hsr':
                            t.myUrl = "http://explorer.h.cash/block/";
                            break;
                        case 'lch':
                            t.myUrl = "http://explorer.litecoincash.tech/block/";
                            break;
                        case 'btm':
                            t.myUrl = "http://blockmeta.com/block/";
                            break;
                    }
                });
                var dataList3 = {
                    list: data.candidates
                };
                var html3 = template('block-three-tp', dataList3);
                $('#block-three').html(html3);
            }

        });

        _coins.getCoins(coin, function (data) {
            $("#workers").html(data.minersTotal);
            $("#pool_hash").html(_reset.formatHashrate(data.hashrate));
            if(data.nodes != null){
                $("#net_diff").html(_reset.changeDiff(data.nodes[0].difficulty));
            }
            $("#last-one").html(_reset.getDateDiff(data.stats.lastBlockFound));
            $("#blocks").html(data.maturedTotal);

            if (typeof (data.poolCharts) != 'undefined' || data.poolCharts.length > 0) {
                xTime = [];
                yData = [];
                var dw = "";
                $.each(data.poolCharts, function (i, t) {

                    xTime.unshift(t.timeFormat.replace(/_/,':'));
                    yData.unshift(_reset.formatHashrateWithoutSuffix(t.poolHash));
                });
                dw = _reset.formatSuffix(data.poolCharts[0].poolHash);
            }
            var w = $(window).width();
            var interval = 0,left;
            if(w <= 700){
                interval = 5;
                left = "15%";
            }else{
                interval = 2;
                left = "11%"
            }

            var options = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    },
                    position: function (pt) {
                        return [pt[0], '10%'];
                    },
                    formatter: "{c}"+dw+"<br>{b}",
                    confine: true
                },
                grid: {
                    left: left,
                    bottom: 100,
                    right: "5%"
                },
                title: false,
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    axisLabel: {
                        interval:interval,
                        rotate: 60
                    },
                    data: []
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel:{
                        formatter:'{value}'+dw
                    }
                },
                series: [
                    {
                        type: 'line',
                        smooth: true,
                        sampling: 'average',
                        itemStyle: {
                            normal: {
                                color: 'rgb(254, 161, 18)'
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(254, 161, 18)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(255, 255, 255)'
                                }])
                            }
                        },
                        data: []
                    }
                ]
            };
            options.series[0].data = yData;
            options.xAxis.data = xTime;
            var chartId = document.getElementById('calc-chart');
            var myChart = echarts.init(chartId);
            $(window).resize(function () {
                myChart.resize();
            })
            // 绘制图表
            myChart.setOption(options);
        }, function (error) {
        });

        // $.get("/currencies/"+coinType,function (data) {
        //     var text = $(data).find('.coinprice').html();
        //     $(".etcprice").html(text);
        // });

        _coins.getPrice(coin, function (error, data) {
            if (data.data)
                $("#price").html('￥' + data.data[0].priceCny + '(' + data.data[0].rose + ')');
        })

    },
    default: function () {
        if(coin == 'lch'){
            return
        }
        if(coin == 'btm'){
            $(".btmIcon").show();
        }
        if(localStorage.coinIndex){
            var coinIndex = localStorage.coinIndex;
            $(".coin-title li").removeClass("active").eq(coinIndex).addClass("active");
            $(".tab").hide().eq(coinIndex).show();
        }
        var teachHtml = util.renderHtml(teach);
        $(".teach").html(teachHtml);
        var imgUrl = require('images/' + coin + '.png');
        var imgTempl = '<img src="' + imgUrl + '" />';
        $('.coin-logo').html(imgTempl);
        $(".coin-name").html(upper);
        $("#coin-name").html(upper);
        $("#address").attr('data-i18n', '[placeholder]input.'+coin+'Placeholder');
        $("#html-title").html(upper + '矿池 - 91pool');
        var mPrice,payment,reward;
        switch (coin) {
            case 'etc':
                mPrice = "1ETC";
                payment = "1%";
                reward = "4ETC";
                break;
            case 'etf':
                mPrice = "0.1ETF";
                payment = "1%";
                reward = "3ETF";
                break;
            case 'hsr':
                mPrice = "0.1HSR";
                payment = "0%";
                reward = "1.584HSR";
                break;
            case 'lch':
                mPrice = "0.1LCH";
                payment = "0%";
                reward = "25LCH";
                break;
            case 'btm':
                mPrice = "1BTM";
                payment = "1%";
                reward = "412.5BTM";
                break;
            case 'xdag':
                mPrice = "100XDAG";
                payment = "0%";
                reward = "420.5XDAG";
                break;
        }
        $("#mPrice").html(mPrice);
        $("#payment").html(payment);
        $("#reward").html(reward);
    },
    setBaidu : function () {
        if(coin === 'etc'){
            $("#baidu").attr("src","https://hm.baidu.com/hm.js?3486de3be2cbc530bb79945f4b87f0d8");
        }
        else if(coin === 'etf'){
            $("#baidu").attr("src","https://hm.baidu.com/hm.js?47d6096998f3b16663aa637d3ada3443");
        }
        else if(coin === 'hsr'){
            $("#baidu").attr("src","https://hm.baidu.com/hm.js?635b661136fcc9cd418e2d71052312d0");
        }
        else if(coin === 'btm'){
            $("#baidu").attr("src","https://hm.baidu.com/hm.js?54a8a321e608052c96b72be4e84304c4");
        }
    },
    setwx : function () {
        var baseUrl = location.href.split("#")[0];
        mwx.setWxInfo(upper+"矿池介绍","专注于数字资产增值服务",baseUrl);
    },
    setIndex : function () {
        $(window).on('unload', function() {
            localStorage.removeItem('coinIndex');
        });

        $(window).on('beforeunload', function() {
            localStorage.removeItem('coinIndex');
        });
    }
};
$(function () {
    index.init();
    i18next.init({
        lng: lang,
        resources: json
    }, function (err, t) {
        jqueryI18next.init(i18next, $);
        $(document).localize();
    });
});

