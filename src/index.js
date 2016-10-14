/**
 * Date: 2016/09/21
 * Author: alanzhang
 * Overview: 日历插件，用于移动端的日期选择
 * TODO：
 * 1.切换年
 * 2.国际化
 * 3.日历从周一还是周日开始
 *
 */

var _ = require("underscore");
// require("./ui-mcalendar.css");

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
    $: function(selector) {
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
    addEventLister: function(ele, eventType, callback) {
        if (!ele) {
            return null;
        }

        if (eventType.toLowerCase() === "tap") {
            eventType = "click";
            // eventType = typeof window.ontouchstart != "undefined" ? "touchstart" : "click";
        }

        ele.addEventListener(eventType, callback);
    },

    /**
     * [setElementValue 给指定dom元素设定值]
     * @param {Element} ele   [元素]
     * @param {string} value [设置的值]
     */
    setElementValue: function(ele, value) {
        if (_.isElement(ele)) {
            var tagName = ele.tagName.toLowerCase();
            var attr = ["input", "textarea"].indexOf(tagName) > -1 ? "value" : "innerHTML";
            ele[attr] = value;
        }
    },

    /**
     * [removeItemsClass 移除容器中的子元素的指定class]
     * @param  {Element} wrapper   [容器]
     * @param  {String}  className [className]
     * @return {[type]}            [description]
     */
    removeItemsClass: function(wrapper, className){
        if(!(wrapper && className)){
            return;
        }
         _.each(wrapper.querySelectorAll("."+className),function(item) {
            item.classList.remove(className);
        });
    },
};

/**
 * [DateUtil 处理日期的工具类，不对外开发]
 * @type {Object}
 */
var DateUtil = {
    /**
     * [format 格式化日期]
     * @param  {Date} utcString   [可实例化为Date对象的变量,String 或者Date]
     * @param  {[type]} pattern   [日期格式]
     * @return {[type]}           [description]
     */
    getFormatDate: function(utcString, pattern) {
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
                //火狐浏览器不支持new Date("2014-12-12 12:12:12")的形式，
                //只能使用 new Date("2014/12/12 12:12:12")
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

        return res.replace("yyyy", year).replace("MM", month).replace("dd", date)
                  .replace("hh", hour).replace("mm", minute).replace("ss", secomnd);
    },

    /**
     * [sameDate 判断是否为同一天]
     * @param  {Date} d1 [日期对象]
     * @param  {Date} d2 [日期对象]
     * @return {[type]}    [description]
     */
    sameDate: function(d1, d2) {
        if (_.isDate(d1) && _.isDate(d2)) {
            return d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
        } else {
            return false;
        }
    },

    /**
     * [getDateListByStartEnd 根据起始点，获取期间的所有的日期，包括起始日期]
     * @param  {Date} startDate [开始日期]
     * @param  {Date} endDate   [结束日期]
     * @return {Array}          [日期对象数组]
     */
    getDateListByStartEnd: function(startDate, endDate) {
        var list = [];
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        endDate.setHours(0);
        endDate.setMinutes(0);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);

        for (var i = +startDate, j = +endDate; i <= j; i = i + 24 * 3600000) {
            list.push(new Date(i));
        }
        return list;
    },

    /**
     * [isIntheDistance 判断某个日期是否在某个时间段内,包括起始日期]
     * @param  {Date}  targetDate [目标日期]
     * @param  {Date}  startDate  [起始日期]
     * @param  {Date}  endDate    [结束日期]
     * @return {Boolean}          [是否包含，true即表示包含在内，false则不包含]
     */
    isIntheDistance: function(targetDate,startDate,endDate){
        targetDate = _.isDate(targetDate) ? targetDate : new Date(targetDate);
        startDate = _.isDate(startDate) ? startDate : new Date(startDate);
        endDate = _.isDate(endDate) ? endDate : new Date(endDate);

        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        endDate.setMilliseconds(59);

        return (+startDate <= +targetDate) && (+targetDate <= +endDate);
    },

    /**
     * [getDateDistance 获取2个日期之间的天数差，包括本身，比如10/01-10/31为31而不是30]
     * @param  {Date} one [起始日期]
     * @param  {Date} two [结束日期]
     * @return {Number}   [天数]
     */
    getDateDistance: function(one, two) {
        var start = new Date(one),
            end = new Date(two);

        if (start > end) {
            var temp = start;
            start = end;
            end = temp;
        }
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);

        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);

        return Math.abs((+end - +start + 1000) / (24 * 60 * 60 * 1000));
    },

    /**
     * [getMDayCount 给定年月获取当月天数]
     * @param  {Number} y [年]
     * @param  {Number} m [月，1-12]
     * @return {[type]}   [description]
     */
    getMDayCount: function(y, m) {
        var mday = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
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
    getWeekNumber : function(y, m, d) {
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
    getPrevMonth : function(y, m) {
        var lastMonth = m - 1;
        var lastMonthYear = y;
        if (lastMonth === 0) {
            lastMonth = 12;
            lastMonthYear = y - 1;
        }
        return {
            month : lastMonth,
            year : lastMonthYear
        };
    },

    /**
     * [getPrevMonth 获取给定月份的下一个月的月份]
     * @param  {Number} y [年]
     * @param  {Number} m [月]
     * @return {JSON}   [包含年月的json对象]
     */
    getNextMonth : function(y, m) {
        var nextMonth = +m + 1;
        var nextMonthYear = y;
        if (nextMonth == 13) {
            nextMonth = 1;
            nextMonthYear = y + 1;
        }
        return {
            month : nextMonth,
            year : nextMonthYear
        };
    },

    /**
    * [getCalendarInfo 获取某个月的日历信息，计算出7x6个空格中每个空格的日期]
    * @param  {Number} y [年]
    * @param  {Number} m [月1-12]
    * @return {[json]}   [包含日期的数组，每个元素为单个对象]
    */
    getCalendarInfo : function(y, m) {
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

        for (i = firstWeekNumber === 0 ? 6 : (firstWeekNumber - 1); i >= 0; --i) {
            info[index] = {
                date: (lastMonthDayCount - i),
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
                isThisMonth:true,
                year: y
            };
            ++index;
        }
        // 计算当月结束时的索引
        var endIndex = index -1;

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
            info:info,
            startIndex:startIndex,
            endIndex:endIndex
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
        templateStr: require("../templates/mcalendar.html"),

        // 默认包含日历的元素
        wrapper: window.document.body,

        // valueTarget,与日历绑定的元素，在选择某个日期后，将值付给该元素
        valueTarget: null,

        // 显示星期的名称
        weekdates: ["日", "一", "二", "三", "四", "五", "六"],

        // 选择某个日期之后自动隐藏
        autohide: true,

        // 初始化时是否直接显示
        initshow: false,

        // 显示时的日期格式
        dataFormat: "yyyy-MM-dd",

        // 那些日期可点击,如果是all, 则无限制，如果是数组，则只有在数组中的元素可点击
        enableList: "all",

        // 默认显示的日期
        defaultDate: "",

        // 工具栏列表
        /*
         * [{
         *     text:"关闭",
         *     className:"closeCalendar",
         *     action:function(instance,item){
         *         instance.hide(function (instance) {
         *             console.log(instance);
         *         });
         *         console.log(item);
         *     }
         * },{...}]
         */
        toolList: [],

        // 是否显示工具栏
        showToolBar: false,

        // 是否包含mask遮罩
        hasMask: false,

        // startEndSelect，日历是否能选择起始时间段，默认值false只能选择一个日期
        startEndSelect: false,

        // 选取起始日期时，填入输入框的日期格式
        startEndDataFormat:"yyyy/MM/dd-yyyy/MM/dd",

        // 用于记录用户选择的起始日期，最多为2个
        startendList:[],

        //startEndSelect 为true时的区间选择配置，默认无效
        /*
         * 示例配置
         * startEndConfig:{
         *     // 可以选择的最早日期
         *     allowStartDate:"2015/10/01",
         *     // 可以选择的最晚日期
         *     allEndDate:"2017/10/01",
         *     // 起始日期差不能大于90，包括起始日期在内
         *     duration:100,
         *     // 起始日期中的日期class
         *     itemClass:"startenditem",
         *     exceedDuration:function(){}
         * },
        */

        /**
         * [selectDateCallback 选中某个日期之后的回调]
         * @param  {NODE} el       [点击的日期的dom元素]
         * @param  {JSON} dateInfo [JSON对象]
         * @return {[type]}        [description]
         */
        selectDateCallback: function(el, dateInfo) {},

        /**
         * [selectMonth 切换月份之后的回调]
         * @param  {JSON}         monthAndYear [选择的月份及年]
         * @param  {futuCalendar} instance     [日历实例]
         * @param  {Number}       offset       [{-1,0,1}-1表示点击了上一个月，1表示点击了下一个月,0表示当月]
         * @return {[type]}                    [description]
         */
        selectMonth: function(instance, monthAndYear, offset) {},

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
            // 对于可选的日期进行着重突出
            prominent: "selectable",
            // 表示是起始时间点的样式
            startEndFlag: "startendflag",
            // 表示是起始点中的日期
            startEndItem: "startenditem"
        },

        // 默认的起始日期配置
        defaultStartEndConfig: function() {
            return {
                duration: 10000000,
                itemClass: this.classMap.startEndItem
            };
        },

        // mask的样式
        maskClassName: "futu-calendar-mask",

        // 标志日历的class
        calendarClassName: "futu-calendar",

        // 标志显示起始日期的class
        startendBar: "startend-bar"
    },

    /**
     * [initOption 初始化日历配置]
     * @param  {JSON} option   [配置对象]
     * @return {JSON}          [整合后的配置对象]
     */
    initOption: function(option) {
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

        // 是否允许选择时间段
        _option.startEndSelect = _option.startEndSelect || Boolean(option.startEndSelect);
        if (_option.startEndSelect) {
            _option.startEndConfig = _.extend(_option.defaultStartEndConfig(), option.startEndConfig);

            // 存在配置则根据起始日期获取可点击的日期列表
            if (_option.startEndConfig && _option.startEndConfig.allowStartDate &&
                _option.startEndConfig.allEndDate) {
                // 覆盖用户设置的可点击区域
                option.enableList = DateUtil.getDateListByStartEnd(
                    _option.startEndConfig.allowStartDate, _option.startEndConfig.allEndDate);

            } else {
                _option.enableList = "all";
            }
        }

        // 如果设定了数组则生成一个{yyyy--MM-dd：yyyy--MM-dd}的map便于查找
        if (Array.isArray(option.enableList)) {
            var enableMap = {}, str;
            option.enableList.forEach(function(item) {
                str = DateUtil.getFormatDate(item, "yyyy-MM-dd");
                enableMap[str] = str;
            });
            _option.enableList = option.enableList;
            _option.enableMap = enableMap;
        } else if (option.enableList === "all") {
            _option.enableList = option.enableList;
        }

        // 工具栏列表
        _option.toolList = option.toolList || [];

        // 是否显示工具栏
        _option.showToolBar = Boolean(option.showToolBar);

        // 是否理解显示日历
        _option.initshow = _option.initshow || Boolean(option.initshow);

        // 是否具有遮罩层
        _option.hasMask = _option.hasMask || Boolean(option.hasMask);

        // 单个日期格式
        _.isString(option.dataFormat) && (_option.dataFormat = option.dataFormat);

        // 起始日期格式
        _.isString(option.startEndDataFormat) && (_option.startEndDataFormat = option.startEndDataFormat);

        // 预处理模板，主要是记性星期的名称初始化，以及可能存在的国际化处理
        _option.templateStr = CalendarUtil.preDealTemplate(_option.templateStr,_option);

        return _option;
    },

    /**
     * [preDealTemplate 对日历模板进行预处理，主要是对星期名称进行处理]
     * @return {String} [description]
     */
    preDealTemplate: function(templateStr, option) {

        // 预处理阶段，通过{{}}的方法来替换对应变量
        // 因为会对一个模板进行2次编译
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
    generateHTML: function(instance, date) {
        var option = instance.option;

        // 显示日期，用于确定要显示的月
        // 如果未传，如果未传则取当前用户选中的日期，其次是用户最初设定的日期
        var d = date || instance.currentSelectDate || option.defaultDate || new Date();

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
        this.completeDayInfo(instance,instance.calInfo, instance.currentSelectDate);

        // 生成主体dom结构
        var html = _.template(option.templateStr)({
            calInfo: calInfo
        });

        // 生成工具条
        instance.toolBarStr = this.createToolBar(instance);

        // 使用Fragment提高效率
        var docfreg = document.createDocumentFragment();
        var temp = document.createElement("div");
        temp.innerHTML = html;
        docfreg.appendChild(temp);

        // 在加入文当前处理，提高效率
        var toolBar = docfreg.querySelector(".tool-bar");
        toolBar.innerHTML = instance.toolBarStr;
        toolBar.style.display = option.showToolBar ? "block" : "none";

        // 移除已经存在dom元素
        var exitsInstaceDom = option.wrapper.querySelector("."+option.calendarClassName);
        exitsInstaceDom && option.wrapper.removeChild(exitsInstaceDom);

        // 加入遮罩
        if (option.hasMask) {
            docfreg.querySelector("."+option.calendarClassName).classList.add("maskable");
            var m = option.wrapper.querySelector("."+option.maskClassName);
            !m && option.wrapper.appendChild(this.createMask(option.maskClassName));
            instance.mask = option.wrapper.querySelector("."+option.maskClassName);
        }

        // 如果已经选择了起始日期，则也应该显示在日历中
        var dateStr = instance.getDateInfo().dateStr;
        option.startEndSelect && Boolean(dateStr) &&
        BASE.setElementValue(docfreg.querySelector("."+option.startendBar), dateStr);

        // 加入新元素
        if (docfreg.children) {
            option.wrapper.appendChild(docfreg.children[0].children[0]);
        } else {
            option.wrapper.appendChild(docfreg.childNodes[0].childNodes[0]);
        }

        docfreg = null;
        temp = null;
        toolBar = null;

        // 保存实例
        instance.calendar = option.wrapper.querySelector("."+option.calendarClassName);

        option.startEndSelect && instance.calendar.classList.add("multiple-select");
    },

    /**
     * [createToolBar description]
     * @param {futuCalendar} instance [日历实例]
     * @return {[type]}          [description]
     */
    createToolBar: function(instance) {
        var toolList = instance.option.toolList;

        var str = "";
        toolList.forEach(function(item, i) {
            item.className = item.className + " tool-item";
            str = str + "<a href='javascript:void(0)' tool-id='"+i+"'  class='"+item.className+"'>" +
                            item.text +
                        "</a>";

        });

        return _.template(str)({
            calInfo: instance.calInfo
        });
    },

    /**
     * [createMask 创建遮罩层]
     * @param  {String} maskClassName [遮罩class]
     * @return {Element}              [遮罩元素]
     */
    createMask: function (maskClassName) {
        var mask = document.createElement("div");
        mask.className = maskClassName;
        return mask;
    },

    getTargetItem: function(instance,target){
        var obj = {};
        // 获取当前选择的日期元素
        if (_.isDate(target)) {
            obj.currentSelectDate = target;
            obj.targetEle = instance.getItem(target);
        } else if (_.isElement(target)) {
            obj.targetEle = target;
            var dataIndex = target.getAttribute("date-index").split("-")[1] - 0;
            var dateInfo = instance.calInfo.list[dataIndex];
            obj.currentSelectDate = new Date(dateInfo.year, dateInfo.month - 1, dateInfo.date);
        } else {
            return null;
        }
        return obj;
    },

    /**
     * [addItemsClass 给定一个时间段，给时间段内的日期元素加上class]
     * @param {futuCalendar} instance  [日期实例]
     * @param {Date}         startDate [开始日期]
     * @param {Date}         endDate   [结束日期]
     * @param {String}       className [className]
     */
    addItemsClass: function(instance, startDate, endDate, className) {
        var start = instance.getItemIndexByDate(startDate);
        var end = instance.getItemIndexByDate(endDate);
        end < start ? 42 : end;

        var item;
        for (var i = start; i <= end; i++) {
            item = instance.getItem(i);
            item && item.classList.add(className);
        }
    },

    /**
     * [setCalendar 根据日期或者选中的日期元素重新设定当前日期变量]
     * @param {futuCalendar} instance [日历实例]
     * @param {[type]}       target   [element或者日期对象]
     * @param {Function}     callback [回调函数]
     */
    setCalendar: function(instance,target,callback){
        var option = instance.option;
        var classMap = option.classMap;
        var wrapper = option.wrapper;
        var startendList = option.startendList.slice(0);
        var startEndConfig = option.startEndConfig;

        var targetInfo = this.getTargetItem(instance,target);
        if (!targetInfo) {
            return
        };

        var targetEle = targetInfo.targetEle;
        var currentSelectDate = targetInfo.currentSelectDate;

        // 选择起始日期
        if (option.startEndSelect) {
            startendList.push(currentSelectDate);
            var length = startendList.length;

            // 比较2个日期之间距离差是否超过设置
            if (length === 2) {
                var days = DateUtil.getDateDistance(startendList[0],startendList[1]);

                // 选择的2个日期时间差超过了设置
                if (days > startEndConfig.duration) {

                    // 起始日期超出时间差时的回调
                    _.isFunction(startEndConfig.exceedDuration) &&
                    startEndConfig.exceedDuration(days,currentSelectDate);
                    return;
                } else {
                    startendList.sort(function(a, b) {
                        return a - b > 0;
                    });
                    this.addItemsClass(instance,startendList[0],startendList[1],startEndConfig.itemClass);
                }

            // 当前已经选择了2个日期，则再次选择时需要清除之前的选择
            } else if (length > 2) {
                BASE.removeItemsClass(wrapper,classMap.startEndFlag);
                BASE.removeItemsClass(wrapper,startEndConfig.itemClass);
                startendList = [startendList[2]];
            }

            // 为当前日期加上标志class
            targetEle && targetEle.classList.add(classMap.startEndFlag);
            currentSelectDate = startendList[0];
            option.startendList = startendList;

        // 普通的选择单个日期
        } else {
            // 添加选中样式
            BASE.removeItemsClass(wrapper,classMap.selected);
            targetEle.classList.add(classMap.selected);
        }

        instance.currentSelectDate = currentSelectDate;
        // 如果存在与日历绑定的元素，则将值设置进入该元素
        var dateStr = instance.getDateInfo().dateStr;
        BASE.setElementValue(option.valueTarget,dateStr );
        option.startEndSelect && BASE.setElementValue(instance.calendar.querySelector("."+option.startendBar),dateStr);

        _.isFunction(callback) && callback();
    },

    /**
     * [bindEvents 进行事件监听]
     * @param  {futuCalendar} instance [实例]
     * @return {[type]}        [description]
     */
    bindEvents: function(instance) {
        var option = instance.option;
        var that = this;

        BASE.addEventLister(option.wrapper,"tap",function(e){
            var target = e.target,
                classList = target.classList;

            // 点击上一个月
            if (classList.contains("emLeft")) {
                instance.goLastMonth(option.selectMonth);

            // 点击下一个月
            } else if (classList.contains("emRight")) {
                instance.goNextMonth(option.selectMonth);

            // 点击工具栏
            } else if(classList.contains('tool-item')){
                var func = instance.option.toolList[target.getAttribute("tool-id") - 0].action;
                if(_.isFunction(func)) {
                    func(instance,target);
                }

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

                if (dateInfo.isCliable) {
                    // 点击日期之后，需要重新设置日期变量，主要是currentSelectDate字段及相关样式
                    that.setCalendar(instance, target, function() {
                        instance.option.selectDateCallback(target, instance.getDateInfo());
                    });
                }

                // 设置了自动隐藏，则选中日期之后隐藏
                if (instance.option.autohide) {
                    instance.hide();
                }
            }
            e.stopPropagation(true);
        });

        // 给绑定的输入框绑定事件
        BASE.addEventLister(instance.option.valueTarget,"tap",function(e){
            instance.show();
            e.stopPropagation(true);
        });

        // 点击其他地方时，隐藏日历
        BASE.addEventLister(document, "tap", function(e) {
            var cal = null;

            if (e.target.closest) {
                cal = e.target.closest('.'+option.calendarClassName);
            }

            _.each(document.querySelectorAll("."+option.calendarClassName), function(item) {
                if (cal != item) {
                    item.style.display = "none";
                    var mask = item.parentNode.querySelector("."+option.maskClassName);
                    mask && (mask.style.display = "none");
                }
            });
        });
    },

    /**
     * [completeDayInfo 完善每一天的日期信息]
     * @return {[type]} [description]
     */
    completeDayInfo: function(instance,calInfo,currentSelectDate) {
        var dateList = calInfo.list,
            today = new Date(),
            option = instance.option,
            classMap = option.classMap,
            enableList = option.enableList,
            enableMap = option.enableMap,
            startEndConfig = option.startEndConfig,
            startendList = option.startendList.sort(function(a,b){
                return a - b > 0;
            });

        if (!Array.isArray(dateList) || dateList.length === 0) {
            return dateList;
        }

        dateList.map(function(item) {
            var d;
            item.classList = [classMap.normal];

            // 判断是否为可选择
            // 全部可点击
            if (enableList === "all") {
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
            }

            // 单选日期
            if (!option.startEndSelect) {
                // 当前单选时选中的日期
                if (DateUtil.sameDate(d, currentSelectDate)) {
                    item.classList.push(classMap.selected);
                }

            // 选择起始日期
            } else {
                // 是否为选中的起始日期
                startendList.forEach(function(date) {
                    if (DateUtil.sameDate(date, d)) {
                        item.classList.push(classMap.startEndFlag);
                    }
                });

                if (DateUtil.isIntheDistance(d, startendList[0], startendList[1]) &&
                    startEndConfig.itemClass) {
                    item.classList.push(startEndConfig.itemClass);
                }
            }
            return item;
        });

        return instance;
    }
};

/**
 * [futuCalendar 处理日期的类]
 * @return {[type]} [description]
 */
function futuCalendar(option){

    // 初始化组件设置参数
    this.option = CalendarUtil.initOption(option);

    // 当前选中的日期
    this.currentSelectDate = this.option.defaultDate || new Date();

    // 生成组件dom结构并插入具体容器中
    CalendarUtil.generateHTML(this);

    // 进行事件监听
    CalendarUtil.bindEvents(this);

    // 初始化及触发的事件
    this.option.selectMonth(this,this.calInfo.current,0);

    // 初始化时默认隐藏与否
    this.calendar.style.display = this.option.initshow ? "block":"none";

    // 是否显示默认的值
    BASE.setElementValue(this.option.valueTarget,
            DateUtil.getFormatDate(this.option.defaultDate,this.option.dataFormat));
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
    show: function(callback) {

        // 如果当前保存的选中的日期与 当前所在月数不相同，则需要重新render日期及月数
        if (this.calInfo.current.month - 0 != this.currentSelectDate.getMonth() + 1) {
            CalendarUtil.generateHTML(this);
        }

        this.calendar.style.display = "block";
        if (!!this.mask) {
           this.mask.style.display = "block";
        }
        _.isFunction(callback) && callback(this);
        return this;
    },

    /**
     * [hide 隐藏日历]
     * @param  {Function} callback [回调函数]
     * @return {[type]}            [description]
     */
    hide: function(callback) {
        this.calendar.style.display = "none";
        if (!!this.mask) {
           this.mask.style.display = "none";
        }
        _.isFunction(callback) && callback(this);
        return this;
    },

    /**
     * [getDateInfo 获取到选择的日期信息]
     * @return {[type]}            [description]
     */
    getDateInfo: function() {
        var option = this.option;
        // 如果设置了选取起始时间
        if (option.startEndSelect) {
            var list = option.startendList.slice(0);
            list.sort(function(a, b) {
                return a - b > 0
            });

            // 如果只选择了一个日期，则起始日期均为该日期
            (list.length < 2) && (list[1] = list[0]);
            var str1 = DateUtil.getFormatDate(list[0], option.startEndDataFormat);
            var str2 = DateUtil.getFormatDate(list[1], str1);

            return {
                date: option.startendList.slice(0),
                dateStr: str2
            };

        } else {
            return {
                date: this.currentSelectDate,
                dateStr: DateUtil.getFormatDate(this.currentSelectDate, option.dataFormat)
            };
        }
    },

    /**
     * [goLastMonth 到上一个月]
     * @param  {Function} callback [回调函数]
     * @return {[type]}            [description]
     */
    goLastMonth: function(callback) {
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
    goNextMonth: function(callback) {
        // 获取下一个月的年月
        var next = DateUtil.getNextMonth(this.calInfo.current.year, this.calInfo.current.month);

        // 渲染
        CalendarUtil.generateHTML(this, new Date(next.year, next.month - 1, 1));

        // 回调
        _.isFunction(callback) && callback(this, this.calInfo.current, 1);

        return this;
    },

    /**
     * [setDate 设置日历的日期,该日期被选中]
     * @param {Date}     date     [回调函数]
     * @param {Function} callback [description]
     */
    setDate: function(date, callback) {

        // 如果该日期为当月日期，则直接改变当前日历的选中项即可
        if (date.getFullYear() == this.calInfo.current.year &&
            date.getMonth() + 1 == this.calInfo.current.month) {
            CalendarUtil.setCalendar(this, date);

        // 如果在他月，则重新渲染日期
        } else {
            this.currentSelectDate = _.isDate(date) ? date : new Date(date);
            CalendarUtil.generateHTML(this, date);
        }

        // 设置绑定的input等元素的值
        BASE.setElementValue(this.option.valueTarget,this.getDateInfo().dateStr);

        // 回调
        _.isFunction(callback) && callback(this);

        return this;
    },

    /**
     * [setSEPoints 在开启选取起始点功能时，设置指定起始点间的日期被选中,
     * 注意，此时会限制于startencconfig中的设置]
     * @param {Date}     startDate [开始时间]
     * @param {Date}     endDate   [结束时间]
     * @param {Function} callback  [回调函数]
     */
    setSEPoints: function(startDate,endDate,callback){
        var option = this.option,
            startEndConfig = this.option.startEndConfig,
            wrapper = this.calendar;

        startDate = _.isDate(startDate) ? startDate: new Date(startDate);
        endDate = _.isDate(endDate) ? endDate: new Date(endDate);

        if (!option.startEndSelect) {
            return;
        }

        // 指定的起始点不在允许的范围内
        if (!DateUtil.isIntheDistance(startDate, startEndConfig.allowStartDate, startEndConfig.allEndDate) ||
            !DateUtil.isIntheDistance(endDate, startEndConfig.allowStartDate, startEndConfig.allEndDate)) {
            throw new Error("指定的起始点不在允许的范围内");
            return;
        }

        // 指定的2个日期时间差超过了设置
        if (DateUtil.getDateDistance(startDate, endDate) > startEndConfig.duration) {
            throw new Error("指定的起始点时间差超出了允许的范围");
            return;
        }

        this.option.startendList = [startDate, endDate].sort(function(a,b){
            return a - b > 0;
        });
        this.currentSelectDate = option.startendList[0];

        // 设置的起始日期在当前显示的日历中
        if (this.calInfo.current.month - 1 == this.currentSelectDate.getMonth()) {
            // 清楚以前的标志
            BASE.removeItemsClass(wrapper, option.classMap.startEndFlag);
            BASE.removeItemsClass(wrapper, option.startEndConfig.itemClass);
            // 为指定的日期加上标志
            CalendarUtil.addItemsClass(this, option.startendList[0], option.startendList[1], startEndConfig.itemClass);

            // 标出起始点
            var that = this, flagItem;
            option.startendList.forEach(function(item) {
                flagItem = that.getItem(item);
                flagItem && flagItem.classList.add(option.classMap.startEndFlag);
            });
        } else {
            CalendarUtil.generateHTML(this, this.currentSelectDate);
        }

        // 如果存在与日历绑定的元素，则将值设置进入该元素
        var dateStr = this.getDateInfo().dateStr;
        BASE.setElementValue(this.option.valueTarget, dateStr);
        BASE.setElementValue(this.calendar.querySelector("."+option.startendBar),dateStr);

        _.isFunction(callback) && callback(this);

        return this;
    },

    /**
     * [setCliableList 设置可以进行点击的日期]
     * @param {Array}    list         [数组中的日期元素可点击]
     * @param {Function} callback     [回调函数]
     * @param {Boolean}  showRightNow [设置完之后是否理解显示]
     */
    setCliableList: function(list, callback, showRightNow) {

        this.option.enableList = list;

        // 重新设定map值
        var enableMap = {},
            str;
        list.forEach(function(item) {
            str = DateUtil.getFormatDate(item, "yyyy-MM-dd");
            enableMap[str] = str;
        });
        this.option.enableMap = enableMap;

        /*重新渲染，这里设计的不太好*/
        CalendarUtil.generateHTML(this, new Date(this.calInfo.current.year, this.calInfo.current.month - 1, 1));

        if (Boolean(showRightNow)) {
            this.show();
        } else {
            this.hide();
        }

        // 如果存在回调，则将对应日期的dom元素返回
        if (_.isFunction(callback)) {
            var that = this;
            list.forEach(function(item) {
                callback(that.getItem(item));
            });
        }

        return this;
    },

    /**
     * [getItemByDate 根据日期获取某天所在dom元素,日期必须在当月进行了显示]
     * @param  {Date}   date [日期对象或者是能实例化为date的变量]
     * @return {Number}      [索引]
     */
    getItemIndexByDate: function(date) {

        // 非法日期
        if(!_.isDate(date)) {
            return -1;
        }

        date = _.isDate(date) ? date : new Date(date);

        var month = date.getMonth() + 1;
        var currentM = +this.calInfo.current.month;
        // 当前日期不在显示的日历上
        if( Math.abs(month - currentM) > 1) {
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
     * @param  {Date}    date [description]
     * @return {Element}      [description]
     */
    getItem: function (date) {
        var index = -1;

        //传入的是索引
        if (_.isNumber(date) && date < 42) {
            index = date;

            //传入的是日期
        } else {
            index = this.getItemIndexByDate(date);
        }

        return index > -1 ? this.calendar.querySelector("[date-index=item-" + index + "]") : null;
    }
});

module.exports = futuCalendar;