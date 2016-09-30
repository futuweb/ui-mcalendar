/**
 * Date: 2016/09/21
 * Author: alanzhang
 * Overview: 日历插件，用于移动端的日期选择
 * TODO：
 * 1.切换年
 * 2.国际化
 * 3.日历从周一还是周日开始
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

        return res.replace("yyyy", year).replace("MM", month).replace("dd", date)
                  .replace("hh", hour).replace("mm", minute).replace("ss", secomnd);
    },

    /**
     * [sameDate 判断是否为同一天]
     * @return {[type]} [description]
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

        toolList:[],

        showToolBar:false,

        hasMask:false,

        /**
         * [selectDateCallback 选中某个日期之后的回调]
         * @param  {NODE} el       [点击的日期的dom元素]
         * @param  {JSON} dateInfo [JSON对象]
         * @return {[type]}          [description]
         */
        selectDateCallback: function(el, dateInfo) {},

        /**
         * [selectMonth 切换月份之后的回调]
         * @param  {JSON} monthAndYear [选择的月份及年]
         * @param {futuCalendar} instance [日历实例]
         * @param  {Number} offset      [{-1,0,1}-1表示点击了上一个月，1表示点击了下一个月,0表示当月]
         * @return {[type]}             [description]
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

            prominent: "selectable",
        }
    },

    /**
     * [initOption 初始化日历配置]
     * @param  {[type]} option [description]
     * @return {[type]}        [description]
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

        _option.toolList = option.toolList || [];

        _option.showToolBar = Boolean(option.showToolBar);

        _option.initshow = _option.initshow || Boolean(option.initshow);

        _option.hasMask = _option.hasMask || Boolean(option.hasMask);

        // 预处理模板，主要是记性星期的名称初始化，以及可能存在的国际化处理
        _option.templateStr = CalendarUtil.preDealTemplate(_option.templateStr,_option);

        return _option;
    },

    /**
     * [preDealTemplate 对日历模板进行预处理]
     * @return {[type]} [description]
     */
    preDealTemplate: function(templateStr, option) {

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
        instance.completeDayInfo(instance.calInfo, instance.currentSelectDate);

        // 生成主体dom结构
        var html = _.template(option.templateStr)({
            calInfo: calInfo
        });

        // 生成工具条
        instance.toolBarStr = this.createToolBar(instance);

        var docfreg = document.createDocumentFragment();
        var temp = document.createElement("div");
        temp.innerHTML = html;
        docfreg.appendChild(temp);

        // 在加入文当前处理，提高效率
        var toolBar = docfreg.querySelector(".tool-bar");
        toolBar.innerHTML = instance.toolBarStr;
        toolBar.style.display = option.showToolBar ? "block" : "none";

        // 移除已经存在dom元素
        var exitsInstaceDom = option.wrapper.querySelector(".futu-calendar");
        exitsInstaceDom && option.wrapper.removeChild(exitsInstaceDom);

        if(option.hasMask) {
            docfreg.querySelector(".futu-calendar").classList.add("maskable");

            var m = option.wrapper.querySelector(".futu-calendar-mask");
            !m && option.wrapper.appendChild(this.createMask());
            instance.mask = option.wrapper.querySelector(".futu-calendar-mask");
        }

        // 加入新元素
        if (docfreg.children) {
            option.wrapper.appendChild(docfreg.children[0].children[0]);
        } else {
            option.wrapper.appendChild(docfreg.childNodes[0].childNodes[0]);
        }

        docfreg = temp = toolBar = null;

        // 保存实例
        instance.calendar = option.wrapper.querySelector(".futu-calendar");
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

    createMask: function  (instance) {
        var mask = document.createElement("div");
        mask.className = "futu-calendar-mask";
        return mask;
    },

    /**
     * [setCalendar 根据日期或者选中的日期元素重新设定当前日期变量]
     * @param {futuCalendar} instance [日历实例]
     * @param {[type]} target   [element或者日期对象]
     * @param {Function} callback [回调函数]
     */
    setCalendar: function(instance,target,callback){

        var targetEle;

        if (_.isDate(target)) {
            instance.currentSelectDate = target;
            targetEle = instance.getItem(target);
        } else if (_.isElement(target)) {
            targetEle = target;
            var dataIndex = target.getAttribute("date-index").split("-")[1] - 0;
            var dateInfo = instance.calInfo.list[dataIndex];
            instance.currentSelectDate = new Date(dateInfo.year, dateInfo.month - 1, dateInfo.date);
        } else {
            return;
        }

        // 添加选中样式
        var selected = instance.option.wrapper.querySelector(".selected");
        selected && selected.classList.remove(instance.option.classMap.selected);

        targetEle.classList.add(instance.option.classMap.selected);

        // 如果存在与日历绑定的元素，则将值设置进入该元素
        BASE.setElementValue(instance.option.valueTarget,instance.getDateInfo().dateStr);

        _.isFunction(callback) && callback();
    },

    /**
     * [bindEvents 进行事件监听]
     * @param  {实例} instance [实例]
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
                    // 点击日期之后，需要重新设置日期变量，主要是currentSelectDate字段及先关样式
                    that.setCalendar(instance, target, function() {});
                    instance.option.selectDateCallback(target, instance.getDateInfo());
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
                cal = e.target.closest('.futu-calendar');
            }

            _.each(document.querySelectorAll(".futu-calendar"), function(item) {
                if (cal != item) {
                    item.style.display = "none";
                    var mask = item.parentNode.querySelector(".futu-calendar-mask");
                    mask && (mask.style.display = "none");
                }
            });
        });
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
    this.option.initshow
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
     * @param {[type]}   date     [回调函数]
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
     * [completeDayInfo 完善每一天的日期信息]
     * @return {[type]} [description]
     */
    completeDayInfo: function(calInfo,currentSelectDate) {
        var dateList = calInfo.list,
            today = new Date(),
            classMap = this.option.classMap,
            enableList = this.option.enableList,
            enableMap = this.option.enableMap;

        if (!Array.isArray(dateList) || dateList.length === 0) {
            return dateList;
        }

        dateList.map(function(item) {
            item.classList = [classMap.normal];

            // 判断是否为可选择
            // 全部可点击
            if (enableList === "all") {
                item.isCliable = true;
            } else {
                // 部分可点击，则将日期准换为yyyy-MM-dd形式在enableMap中查找
                var d = new Date(item.year, item.month - 1, item.date);
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
                var d = new Date(item.year, item.month - 1, item.date);
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
    setCliableList: function(list,callback,showRightNow){

        this.option.enableList = list;

        // 重新设定map值
        var enableMap = {}, str;
        list.forEach(function(item) {
            str = DateUtil.getFormatDate(item, "yyyy-MM-dd");
            enableMap[str] = str;
        });
        this.option.enableMap = enableMap;

        /*重新渲染，这里设计的不太好*/
        CalendarUtil.generateHTML(this,new Date(this.calInfo.current.year,this.calInfo.current.month - 1,1));

        if(Boolean(showRightNow)){
            this.show();
        }else{
            this.hide();
        }

        // 如果存在回调，则将对应日期的dom元素返回
        if (_.isFunction(callback)) {
            var that = this;
            list.forEach(function(item, i) {
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
     * @param  {[type]} date [description]
     * @return {[type]}      [description]
     */
    getItem: function(date){
        var index = -1;

        //传入的是索引
        if (_.isNumber(date) && date < 42) {
            index = date;

            //传入的是日期
        } else {
            index = this.getItemIndexByDate(date)
        }

        return index  >-1 ? this.calendar.querySelector("[date-index=item-"+index+"]") : null;
    }
});

module.exports = futuCalendar;