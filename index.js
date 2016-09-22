(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["futuCalendar"] = factory();
	else
		root["futuCalendar"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	/**
	 * Date: 2016/09/21
	 * Author: alanzhang
	 * Overview: 日历插件，用于移动端的日期选择
	 * TODO：
	 * 1.切换年
	 * 2.国际化
	 * 3.日历从周一还是周日开始
	 */
	
	var _ = __webpack_require__(1);
	
	/**
	 * [BASE 普通工具方法]
	 * @type {Object}
	 */
	var BASE = {
	    /**
	     * [$ 获取dom元素]
	     * @param  {String} selector [选择器]
	     * @return {Element}         [dom元素]
	     */
	    $: function $(selector) {
	        if (!selector) {
	            return null;
	        }
	        return document.querySelector(selector);
	    },
	
	    /**
	     * [addEventLister 处理事件绑定，主要是处理touchstart事件]
	     * @param  {Element}   ele      [目标元素]
	     * @param  {String}   eventType [事件类型，为tap时会根据设备来判断]
	     * @param  {Function} callback  [回调]
	     * @return {[type]}             [description]
	     */
	    addEventLister: function addEventLister(ele, eventType, callback) {
	        if (!ele) {
	            return null;
	        }
	
	        if (eventType.toLowerCase() === "tap") {
	            eventType = typeof window.ontouchstart != "undefined" ? "touchstart" : "click";
	        }
	
	        ele.addEventListener(eventType, callback);
	    },
	
	    /**
	     * [setElementValue 给指定dom元素设定值]
	     * @param {Element} ele   [元素]
	     * @param {string} value [设置的值]
	     */
	    setElementValue: function setElementValue(ele, value) {
	        if (_.isElement(ele)) {
	            var tagName = ele.tagName.toLowerCase();
	            var attr = ["input", "textarea"].indexOf(tagName) > -1 ? "value" : "innerHTML";
	            ele[attr] = value;
	        }
	    }
	};
	
	/**
	 * [DateUtil 处理日期的工具类，不对外开发]
	 * @type {Object}
	 */
	var DateUtil = {
	    /**
	     * [format 格式化日期]
	     * @param  {<String|Date>} utcString      [可实例化为Date对象的变量]
	     * @param  {[type]} pattern [日期格式]
	     * @return {[type]}           [description]
	     */
	    getFormatDate: function getFormatDate(utcString, pattern) {
	        if (!utcString) {
	            return "";
	        }
	
	        var res = pattern;
	        var d = null;
	
	        if (utcString instanceof Date) {
	            d = utcString;
	        } else {
	            var timeLength = (utcString + "").length;
	
	            // 使用的是毫秒数
	            if (timeLength == 13 && !/\D/.test(utcString + "")) {
	                utcString = Math.floor(utcString - 0);
	                // 使用的秒数
	            } else if (timeLength == 10 && !/\D/.test(utcString + "")) {
	                utcString = Math.floor(utcString - 0) * 1000;
	            }
	
	            // 时间字符串
	            if (typeof utcString == "string") {
	                //火狐浏览器不支持new Date("2014-12-12 12:12:12")的形式，只能使用 new Date("2014/12/12 12:12:12")
	                utcString = utcString.replace(/-/gi, "/");
	            }
	
	            d = new Date(utcString);
	        }
	
	        //不合法的日期
	        if (isNaN(d.getTime())) {
	            return "";
	        }
	
	        var month = d.getMonth() + 1,
	            date = d.getDate(),
	            year = d.getFullYear(),
	            hour = d.getHours(),
	            minute = d.getMinutes(),
	            secomnd = d.getSeconds();
	
	        month = ("00" + month).substr(-2);
	        date = ("00" + date).substr(-2);
	        hour = ("00" + hour).substr(-2);
	        minute = ("00" + minute).substr(-2);
	        secomnd = ("00" + secomnd).substr(-2);
	
	        return res.replace("yyyy", year).replace("MM", month).replace("dd", date).replace("hh", hour).replace("mm", minute).replace("ss", secomnd);
	    },
	
	    /**
	     * [sameDate 判断是否为同一天]
	     * @return {[type]} [description]
	     */
	    sameDate: function sameDate(d1, d2) {
	        if (_.isDate(d1) && _.isDate(d2)) {
	            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
	        } else {
	            return false;
	        }
	    },
	
	    /**
	     * [getMDayCount 给定年月获取当月天数]
	     * @param  {Number} y [年]
	     * @param  {Number} m [月，1-12]
	     * @return {[type]}   [description]
	     */
	    getMDayCount: function getMDayCount(y, m) {
	        var mday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	        if (y % 4 === 0 && y % 100 !== 0 || y % 400 === 0) {
	            mday[1] = 29;
	        }
	        return mday[m - 1];
	    },
	
	    /**
	     * [getWeekNumber 获取指定日期的星期数，]
	     * @param  {Number} y [年]
	     * @param  {Number} m [月，1-12]
	     * @param  {Number} d [日，1-31]
	     * @return {Number}   [从1-7]
	     */
	    getWeekNumber: function getWeekNumber(y, m, d) {
	        var date = new Date();
	        date.setFullYear(y, m - 1, d);
	        return date.getDay();
	    },
	
	    /**
	     * [getPrevMonth 获取给定月份的上一个月的月份]
	     * @param  {Number} y [年]
	     * @param  {Number} m [月]
	     * @return {JSON}   [包含年月的json对象]
	     */
	    getPrevMonth: function getPrevMonth(y, m) {
	        var lastMonth = m - 1;
	        var lastMonthYear = y;
	        if (lastMonth === 0) {
	            lastMonth = 12;
	            lastMonthYear = y - 1;
	        }
	        return {
	            month: lastMonth,
	            year: lastMonthYear
	        };
	    },
	
	    /**
	     * [getPrevMonth 获取给定月份的下一个月的月份]
	     * @param  {Number} y [年]
	     * @param  {Number} m [月]
	     * @return {JSON}   [包含年月的json对象]
	     */
	    getNextMonth: function getNextMonth(y, m) {
	        var nextMonth = +m + 1;
	        var nextMonthYear = y;
	        if (nextMonth == 13) {
	            nextMonth = 1;
	            nextMonthYear = y + 1;
	        }
	        return {
	            month: nextMonth,
	            year: nextMonthYear
	        };
	    },
	
	    /**
	    * [getCalendarInfo 获取某个月的日历信息，计算出7x6个空格中每个空格的日期]
	    * @param  {Number} y [年]
	    * @param  {Number} m [月1-12]
	    * @return {[json]}   [包含日期的数组，每个元素为单个对象]
	    */
	    getCalendarInfo: function getCalendarInfo(y, m) {
	        var dayCount = this.getMDayCount(y, m);
	        var lastMonthInfo = this.getPrevMonth(y, m);
	        var nextMonthInfo = this.getNextMonth(y, m);
	        var lastMonth = lastMonthInfo.month;
	        var lastMonthYear = lastMonthInfo.year;
	        var nextMonth = nextMonthInfo.month;
	        var nextMontYear = nextMonthInfo.year;
	
	        var lastMonthDayCount = this.getMDayCount(lastMonthYear, lastMonth);
	        var firstWeekNumber = this.getWeekNumber(y, m, 1);
	        var info = [];
	        var index = 0;
	        var i;
	
	        for (i = firstWeekNumber === 0 ? 6 : firstWeekNumber - 1; i >= 0; --i) {
	            info[index] = {
	                date: lastMonthDayCount - i,
	                isLastMonth: true,
	                month: lastMonth,
	                year: lastMonthYear
	            };
	            ++index;
	        }
	
	        // 记录挡圈开始时的索引
	        var startIndex = index;
	        for (i = 0; i < dayCount; ++i) {
	            info[index] = {
	                date: i + 1,
	                month: m,
	                isThisMonth: true,
	                year: y
	            };
	            ++index;
	        }
	        // 计算当月结束时的索引
	        var endIndex = index - 1;
	
	        for (i = 1; index < 42; ++index) {
	            info[index] = {
	                date: i,
	                isNextMonth: true,
	                month: nextMonth,
	                year: nextMontYear
	            };
	            ++i;
	        }
	        return {
	            info: info,
	            startIndex: startIndex,
	            endIndex: endIndex
	        };
	    }
	};
	
	/**
	 * [CalendarUtil 操作日历业务的工具类，不对外开放]
	 * @type {Object}
	 */
	var CalendarUtil = {
	
	    // 默认配置
	    defaultOption: {
	        // 模板路径
	        templateStr: __webpack_require__(2),
	
	        // 默认包含日历的元素
	        wrapper: window.document.body,
	
	        // valueTarget,与日历绑定的元素，在选择某个日期后，将值付给该元素
	        valueTarget: null,
	
	        // 显示星期的名称
	        weekdates: ["日", "一", "二", "三", "四", "五", "六"],
	
	        // 选择某个日期之后自动隐藏
	        autohide: true,
	
	        // 显示时的日期格式
	        dataFormat: "yyyy-MM-dd",
	
	        // 那些日期可点击,如果是all, 则无限制，如果是数组，则只有在数组中的元素可点击
	        enableList: "all",
	
	        // 默认显示的日期
	        defaultDate: new Date(),
	
	        /**
	         * [selectDateCallback 选中某个日期之后的回调]
	         * @param  {NODE} el       [点击的日期的dom元素]
	         * @param  {JSON} dateInfo [JSON对象]
	         * @return {[type]}          [description]
	         */
	        selectDateCallback: function selectDateCallback(el, dateInfo) {},
	
	        /**
	         * [selectMonth 切换月份之后的回调]
	         * @param  {JSON} monthAndYear [选择的月份及年]
	         * @param {futuCalendar} instance [日历实例]
	         * @param  {Number} offset      [{-1,0,1}-1表示点击了上一个月，1表示点击了下一个月,0表示当月]
	         * @return {[type]}             [description]
	         */
	        selectMonth: function selectMonth(instance, monthAndYear, offset) {},
	
	        // 显示在当前月历上的日期各种状态的class
	        classMap: {
	            // 其他月分的日期
	            othermonth: "othermonth",
	            // 当前月日期
	            currentmonth: "currentmonth",
	            // 今天
	            today: "today",
	            // 选中的
	            selected: "selected",
	            // 当前选中的日期
	            normal: "date-item",
	
	            prominent: "selectable"
	        }
	    },
	
	    /**
	     * [initOption 初始化日历配置]
	     * @param  {[type]} option [description]
	     * @return {[type]}        [description]
	     */
	    initOption: function initOption(option) {
	        var _option = _.extend({}, this.defaultOption);
	
	        if (!_.isObject(option)) {
	            return _option;
	        }
	
	        // 处理模板
	        if (_.isString(option.templateStr)) {
	            _option.templateStr = option.templateStr;
	        }
	
	        // 日历的包含块可以是元素，也可以是选择器
	        if (_.isElement(option.wrapper)) {
	            _option.wrapper = option.wrapper;
	        } else if (_.isElement(BASE.$(option.wrapper))) {
	            _option.wrapper = BASE.$(option.wrapper);
	        }
	
	        // 处理星期名称
	        if (Array.isArray(option.weekdates)) {
	            _option.weekdates = option.weekdates;
	        }
	
	        // 点击后是否自动隐藏
	        if (typeof option.autohide !== "undefined") {
	            _option.autohide = Boolean(option.autohide);
	        }
	
	        // 显示的默认日期
	        var d = new Date(option.defaultDate);
	        if (!isNaN(d.getTime())) {
	            _option.defaultDate = d;
	        }
	
	        // 选中日期回调
	        if (_.isFunction(option.selectDateCallback)) {
	            _option.selectDateCallback = option.selectDateCallback;
	        }
	
	        // 切换月份回调
	        if (_.isFunction(option.selectMonth)) {
	            _option.selectMonth = option.selectMonth;
	        }
	
	        // 是否和其他元素进行绑定
	        if (_.isElement(option.valueTarget)) {
	            _option.valueTarget = option.valueTarget;
	        } else if (_.isElement(BASE.$(option.valueTarget))) {
	            _option.valueTarget = BASE.$(option.valueTarget);
	        }
	
	        // 如果设定了数组则生成一个{yyyy--MM-dd：yyyy--MM-dd}的map便于查找
	        if (Array.isArray(option.enableList)) {
	            var enableMap = {},
	                str;
	            option.enableList.forEach(function (item) {
	                str = DateUtil.getFormatDate(item, "yyyy-MM-dd");
	                enableMap[str] = str;
	            });
	            _option.enableList = option.enableList;
	            _option.enableMap = enableMap;
	        } else if (option.enableList === "all") {
	            _option.enableList = option.enableList;
	        }
	
	        // 预处理模板，主要是记性星期的名称初始化，以及可能存在的国际化处理
	        _option.templateStr = CalendarUtil.preDealTemplate(_option.templateStr, _option);
	
	        return _option;
	    },
	
	    /**
	     * [preDealTemplate 对日历模板进行预处理]
	     * @return {[type]} [description]
	     */
	    preDealTemplate: function preDealTemplate(templateStr, option) {
	
	        // 预处理阶段，通过{{}}的方法来替换对应变量
	        _.templateSettings = {
	            evaluate: /\{\{([\s\S]+?)\}\}/g,
	            interpolate: /\{\{=([\s\S]+?)\}\}/g,
	            escape: /\{\{-([\s\S]+?)\}\}/g
	        };
	
	        var templateFun = _.template(templateStr);
	
	        return templateFun({
	            "weekdate": option.weekdates
	        });
	    },
	
	    /**
	     * 生成日历dom结构
	     * @return {[type]} [description]
	     */
	    generateHTML: function generateHTML(instance, date) {
	        var option = instance.option;
	
	        // 显示日期，用于确定要显示的月
	        // 如果未传，如果未传则取当前用户选中的日期，其次是用户最初设定的日期
	        var d = date || instance.currentSelectDate || option.defaultDate;
	
	        // 获取当前显示出来的日历中包含的日期
	        var month = DateUtil.getCalendarInfo(d.getFullYear(), d.getMonth() + 1);
	
	        var calInfo = instance.calInfo = {
	            current: {
	                month: ("00" + (d.getMonth() + 1)).substr(-2),
	                year: d.getFullYear()
	            },
	            list: month.info,
	            startIndex: month.startIndex,
	            endIndex: month.endIndex
	        };
	
	        _.templateSettings = {
	            evaluate: /<%([\s\S]+?)%>/g,
	            interpolate: /<%=([\s\S]+?)%>/g,
	            escape: /<%-([\s\S]+?)%>/g
	        };
	
	        // 完善日期信息
	        instance.completeDayInfo(instance.calInfo, instance.currentSelectDate);
	
	        option.wrapper.innerHTML = _.template(option.templateStr)({
	            calInfo: calInfo
	        });
	
	        // 保存实例
	        instance.calendar = option.wrapper.querySelector(".futu-calendar");
	    },
	
	    /**
	     * [setCalendar 根据日期或者选中的日期元素重新设定当前日期变量]
	     * @param {[type]} instance [日历实例]
	     * @param {[type]} target   [element或者日期对象]
	     * @param {Function} callback [回调函数]
	     */
	    setCalendar: function setCalendar(instance, target, callback) {
	
	        if (_.isDate(target)) {
	            instance.currentSelectDate = target;
	        } else if (_.isElement(target)) {
	            var dataIndex = target.getAttribute("date-index").split("-")[1] - 0;
	            var dateInfo = instance.calInfo.list[dataIndex];
	            instance.currentSelectDate = new Date(dateInfo.year, dateInfo.month - 1, dateInfo.date);
	        } else {
	            return;
	        }
	
	        // 添加选中样式
	        var selected = instance.option.wrapper.querySelector(".selected");
	        selected && selected.classList.remove(instance.option.classMap.selected);
	        target.classList.add(instance.option.classMap.selected);
	
	        // 如果存在与日历绑定的元素，则将值设置进入该元素
	        BASE.setElementValue(instance.option.valueTarget, instance.getDateInfo().dateStr);
	
	        _.isFunction(callback) && callback();
	    },
	
	    /**
	     * [bindEvents 进行事件监听]
	     * @param  {实例} instance [实例]
	     * @return {[type]}        [description]
	     */
	    bindEvents: function bindEvents(instance) {
	        var option = instance.option;
	        var that = this;
	
	        BASE.addEventLister(option.wrapper, "tap", function (e) {
	            var target = e.target,
	                classList = target.classList;
	
	            // 点击上一个月
	            if (classList.contains("emLeft")) {
	                instance.goLastMonth(option.selectMonth);
	
	                // 点击下一个月
	            } else if (classList.contains("emRight")) {
	                instance.goNextMonth(option.selectMonth);
	
	                // 点击日期
	            } else {
	                target = target.tagName.toLowerCase() == "span" ? target.parentNode : target;
	                classList = target.classList;
	
	                // 非可点击元素
	                if (!classList.contains(option.classMap.normal)) {
	                    return;
	                }
	
	                var dataIndex = target.getAttribute("date-index").split("-")[1] - 0;
	                var dateInfo = instance.calInfo.list[dataIndex];
	
	                // 设定了只有部分元素可点击，但当前元素不可点击
	                if (!dateInfo.isCliable) {
	                    return;
	                }
	
	                // 点击日期之后，需要重新设置日期变量，主要是currentSelectDate字段及先关样式
	                that.setCalendar(instance, target, function () {
	                    instance.option.selectDateCallback(target, instance.getDateInfo());
	                    // 设置了自动隐藏，则选中日期之后隐藏
	                    if (instance.option.autohide) {
	                        instance.hide();
	                    }
	                });
	            }
	        });
	    }
	};
	
	/**
	 * [futuCalendar 处理日期的类]
	 * @return {[type]} [description]
	 */
	function futuCalendar(option) {
	
	    // 初始化组件设置参数
	    this.option = CalendarUtil.initOption(option);
	
	    // 当前选中的日期
	    this.currentSelectDate = this.option.defaultDate;
	
	    // 生成组件dom结构并插入具体容器中
	    CalendarUtil.generateHTML(this);
	
	    // 进行事件监听
	    CalendarUtil.bindEvents(this);
	
	    // 初始化及触发的事件
	    this.option.selectMonth(this, this.calInfo.current, 0);
	
	    // 初始化时默认隐藏
	    this.calendar.style.display = "none";
	
	    BASE.setElementValue(this.option.valueTarget, DateUtil.getFormatDate(this.option.defaultDate, this.option.dataFormat));
	}
	
	/**
	 * 暴露出去的方法，在prototype对象中
	 */
	_.extend(futuCalendar.prototype, {
	    /**
	     * [show 显示日历]
	     * @param  {Function} callback [回调函数]
	     * @return {[type]}            [description]
	     */
	    show: function show(callback) {
	
	        // 如果当前保存的选中的日期与 当前所在月数不相同，则需要重新render日期及月数
	        if (this.calInfo.current.month - 0 != this.currentSelectDate.getMonth() + 1) {
	            CalendarUtil.generateHTML(this);
	        }
	
	        this.calendar.style.display = "block";
	        _.isFunction(callback) && callback(this);
	        return this;
	    },
	
	    /**
	     * [hide 隐藏日历]
	     * @param  {Function} callback [回调函数]
	     * @return {[type]}            [description]
	     */
	    hide: function hide(callback) {
	        this.calendar.style.display = "none";
	        _.isFunction(callback) && callback(this);
	        return this;
	    },
	
	    /**
	     * [getDateInfo 获取到选择的日期信息]
	     * @return {[type]}            [description]
	     */
	    getDateInfo: function getDateInfo() {
	        return {
	            date: this.currentSelectDate,
	            dateStr: DateUtil.getFormatDate(this.currentSelectDate, this.option.dataFormat)
	        };
	    },
	
	    /**
	     * [goLastMonth 到上一个月]
	     * @param  {Function} callback [回调函数]
	     * @return {[type]}            [description]
	     */
	    goLastMonth: function goLastMonth(callback) {
	        // 获取上一个月的年月
	        var last = DateUtil.getPrevMonth(this.calInfo.current.year, this.calInfo.current.month);
	
	        // 渲染
	        CalendarUtil.generateHTML(this, new Date(last.year, last.month - 1, 1));
	
	        // 回调
	        _.isFunction(callback) && callback(this, this.calInfo.current, -1);
	        return this;
	    },
	
	    /**
	     * [goLastMonth 到下一个月]
	     * @param  {Function} callback [回调函数]
	     * @return {[type]}            [description]
	     */
	    goNextMonth: function goNextMonth(callback) {
	        // 获取下一个月的年月
	        var next = DateUtil.getNextMonth(this.calInfo.current.year, this.calInfo.current.month);
	
	        // 渲染
	        CalendarUtil.generateHTML(this, new Date(next.year, next.month - 1, 1));
	
	        // 回调
	        _.isFunction(callback) && callback(this, this.calInfo.current, 1);
	
	        return this;
	    },
	
	    /**
	     * [setDate 设置日历的日期]
	     * @param {[type]}   date     [回调函数]
	     * @param {Function} callback [description]
	     */
	    setDate: function setDate(date, callback) {
	
	        if (date.getFullYear() == this.calInfo.current.year && date.getMonth() + 1 == this.calInfo.current.month) {
	            CalendarUtil.setCalendar(this, date);
	        } else {
	            CalendarUtil.generateHTML(this, date);
	        }
	
	        // 回调
	        _.isFunction(callback) && callback(this);
	
	        return this;
	    },
	
	    /**
	     * [completeDayInfo 完善每一天的日期信息]
	     * @return {[type]} [description]
	     */
	    completeDayInfo: function completeDayInfo(calInfo, currentSelectDate) {
	        var dateList = calInfo.list,
	            today = new Date(),
	            classMap = this.option.classMap,
	            enableList = this.option.enableList,
	            enableMap = this.option.enableMap;
	
	        if (!Array.isArray(dateList) || dateList.length === 0) {
	            return dateList;
	        }
	
	        dateList.map(function (item) {
	            var d;
	            item.classList = [];
	
	            // 判断是否为可选择
	            // 全部可点击
	            if (enableList === "all") {
	                item.classList = [classMap.normal];
	                item.isCliable = true;
	            } else {
	                // 部分可点击，则将日期准换为yyyy-MM-dd形式在enableMap中查找
	                d = new Date(item.year, item.month - 1, item.date);
	                if (enableMap[DateUtil.getFormatDate(d, "yyyy-MM-dd")]) {
	                    item.classList = [classMap.normal, classMap.prominent];
	                    item.isCliable = true;
	                } else {
	                    item.isCliable = false;
	                }
	            }
	
	            // 当前日期为上一个或下一个月的日期
	            if (Boolean(item.isLastMonth) || Boolean(item.isNextMonth)) {
	                item.classList.push(classMap.othermonth);
	            } else {
	                d = new Date(item.year, item.month - 1, item.date);
	                item.classList.push(classMap.currentmonth);
	
	                // 今天
	                if (DateUtil.sameDate(d, today)) {
	                    item.classList.push(classMap.today);
	                }
	
	                // 当前选中的日期
	                if (DateUtil.sameDate(d, currentSelectDate)) {
	                    item.classList.push(classMap.selected);
	                }
	            }
	            return item;
	        });
	        return this;
	    },
	
	    /**
	     * [setCliableList 设置可以进行点击的日期]
	     */
	    setCliableList: function setCliableList(list, callback) {
	
	        this.option.enableList = list;
	
	        // 重新设定map值
	        var enableMap = {},
	            str;
	        list.forEach(function (item) {
	            str = DateUtil.getFormatDate(item, "yyyy-MM-dd");
	            enableMap[str] = str;
	        });
	        this.option.enableMap = enableMap;
	
	        /*重新渲染，这里设计的不太好*/
	        CalendarUtil.generateHTML(this, new Date(this.calInfo.current.year, this.calInfo.current.month - 1, 1));
	
	        // 如果存在回调，则将对应日期的dom元素返回
	        if (_.isFunction(callback)) {
	            var that = this;
	            list.forEach(function (item) {
	                callback(that.getItem(item));
	            });
	        }
	
	        return this;
	    },
	
	    /**
	     * [getItemByDate 根据日期获取某天所在dom元素,日期必须在当月进行了显示]
	     * @param  {[type]} date [日期对象或者是能实例化为date的变量]
	     * @return {[type]}      [description]
	     */
	    getItemIndexByDate: function getItemIndexByDate(date) {
	
	        // 非法日期
	        if (!_.isDate(date)) {
	            return -1;
	        }
	
	        date = _.isDate(date) ? date : new Date(date);
	
	        var month = date.getMonth() + 1;
	        var currentM = +this.calInfo.current.month;
	        // 当前日期不在显示的日历上
	        if (Math.abs(month - currentM) > 1) {
	            return -1;
	        }
	
	        var dateIndex = date.getDate();
	        var itemIndex = -1;
	
	        // 当前月日期
	        if (month === currentM) {
	            itemIndex = dateIndex + this.calInfo.startIndex - 1;
	
	            // 上月日期
	        } else if (month < currentM) {
	            for (var i = 0; i < this.calInfo.startIndex; i++) {
	                if (this.calInfo.list[i].date === dateIndex) {
	                    itemIndex = i;
	                }
	            }
	
	            // 下月日期
	        } else {
	            itemIndex = dateIndex + this.calInfo.endIndex;
	        }
	
	        return itemIndex;
	    },
	
	    /**
	     * [getItem 根据日期或者索引选取元素]
	     * @param  {[type]} date [description]
	     * @return {[type]}      [description]
	     */
	    getItem: function getItem(date) {
	        var index = -1;
	
	        //传入的是索引
	        if (_.isNumber(date) && date < 42) {
	            index = date;
	
	            //出入的是日期
	        } else {
	            index = this.getItemIndexByDate(date);
	        }
	
	        return index > -1 ? this.calendar.querySelector("[date-index=item-" + index + "]") : null;
	    }
	});
	
	module.exports = futuCalendar;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	(function() {
	
	  // Baseline setup
	  // --------------
	
	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;
	
	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;
	
	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;
	
	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};
	
	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };
	
	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }
	
	  // Current version.
	  _.VERSION = '1.8.3';
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };
	
	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };
	
	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };
	
	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };
	
	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };
	
	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };
	
	  // Collection Functions
	  // --------------------
	
	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };
	
	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };
	
	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }
	
	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);
	
	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);
	
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };
	
	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };
	
	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };
	
	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };
	
	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };
	
	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };
	
	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };
	
	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };
	
	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };
	
	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };
	
	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };
	
	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };
	
	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };
	
	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };
	
	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };
	
	  // Array Functions
	  // ---------------
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };
	
	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };
	
	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };
	
	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };
	
	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };
	
	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };
	
	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);
	
	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };
	
	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }
	
	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };
	
	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  };
	
	  // Function (ahem) Functions
	  // ------------------
	
	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };
	
	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };
	
	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	  };
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };
	
	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };
	
	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };
	
	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);
	
	  // Object Functions
	  // ----------------
	
	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
	
	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
	
	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }
	
	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };
	
	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };
	
	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };
	
	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };
	
	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };
	
	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);
	
	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);
	
	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };
	
	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };
	
	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };
	
	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);
	
	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };
	
	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };
	
	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };
	
	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };
	
	
	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	
	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;
	
	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };
	
	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };
	
	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };
	
	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };
	
	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	
	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }
	
	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	
	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };
	
	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };
	
	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };
	
	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };
	
	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };
	
	  // Utility Functions
	  // -----------------
	
	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };
	
	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };
	
	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };
	
	  _.noop = function(){};
	
	  _.property = property;
	
	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };
	
	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };
	
	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };
	
	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);
	
	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);
	
	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };
	
	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";
	
	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  };
	
	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };
	
	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	
	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };
	
	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };
	
	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);
	
	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });
	
	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });
	
	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
	
	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };
	
	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "<div class=\"futu-calendar\">\r\n    <div class=\"tool-bar\">\r\n        <span class=\"tool-bar-container\">\r\n            <a href=\"javascript:void(0)\" class=\"selectCurrentMonth\"><%=calInfo.current.month%>月全部</a>\r\n            <a href=\"javascript:void(0)\" class=\"selectAfterToday\">今天往后</a>\r\n        </span>\r\n    </div>\r\n    <div class=\"time-bar\">\r\n        <span class=\"time-bar-container\">\r\n            <em class=\"emLeft\"></em>\r\n            <font class=\"current-date\"><%=calInfo.current.year%>年<%=calInfo.current.month%>月</font>\r\n            <em class=\"emRight\"></em>\r\n        </span>\r\n    </div>\r\n    <div class=\"date-container\">\r\n        <div class=\"weekdate\">\r\n            <ul>\r\n                {{ _.each(weekdate, function(item) { }}<li>{{=item}}</li>{{ }) }}\r\n            </ul>\r\n        </div>\r\n        <div class=\"regular-date\">\r\n            <%_.each([0,1,2,3,4,5], function(i) {%>\r\n                <ul>\r\n                    <%_.each([0,1,2,3,4,5,6],function(j){ var item = calInfo.list[j+i*7];%>\r\n                    <li date-index=\"item-<%=j+i*7%>\" class=\"<%=((item.classList)||[]).join(\" \")%>\">\r\n                        <span><%=item.date%></span>\r\n                    </li>\r\n                    <%})%>\r\n                </ul>\r\n            <%});%>\r\n        </div>\r\n    </div>\r\n</div>"

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map