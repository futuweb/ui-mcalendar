# ui-mcalendar
日历选择插件

## 兼容性说明
适用于移动端浏览器

## 安装

```sh
npm install git+http://gitlab.futunn.com/webpackage/ui-mcalendar.git#1.0.0
npm install ui-mcalendar
```

## 使用
支持页面直接引入、AMD、CommonJs的方式加载模块

#### 调用
1.引入样式文件，或者自定义样式 
```
<link rel="stylesheet" type="text/css" href="ui-mcalendar/src/ui-mcalendar.css"/>
```
2.引入js，以直接引入为例
```
<script type="text/javascript" src="ui-mcalendar/index.js"></script>
```
3.实例化插件
HTML:
```
<!--选择日期后值保存在这里-->
<input tpye="input" id="calendarValue"/>
<!--日历容器-->
<div class="wrapper"></div>
```
JS:
```
var input = document.querySelector("#calendarValue");
var cal = new futuCalendar({
    wrapper:".wrapper",
    valueTarget:input,
    selectMonth:function(instance,info,offset){
        alert("你切换了月") 
    },
    selectDateCallback:function(el,dataInfo){
        console.log("你选择了日期");
    }
});
cal.show();
```
一个完整的配置如下：
```
 var cal = new futuCalendar({
    wrapper:".wrapper",
    templateStr:"<div>.....</div>",
    autohide:true,
    showToolBar:true,
    toolList:[{
        text:"关闭",
        className:"closeCalendar",
        action:function(instance,item){
            instance.hide();
            console.log(item);
        }
    }],
    valueTarget:input,
    templateStr:document.querySelector("#templatedemo").innerHTML,
    enableList:["2016-08-01","2016-08-02"],
    defaultDate:new Date("2016-08-01"),
    selectMonth:function(instance,info,offset){
        console.log(info);
    },
    selectDateCallback:function(el,dataInfo){
        console.log(dataInfo);
    }
});
```

## 目录结构
![](asserts/1.png)

`example`: 示例目录
`src`:组件源码，commonjs模式，不可直接运行；ui-calendar.css 默认提供的样式
`template`：日历模板
`gulpfile`：打包配置
`index.js`：打包后的源码
`readme.md`：说明文档

## API
#### 1. `futuCalendar(config)`
构造函数，参数：

- `config`: 日历配置相关参数，json对象，具体字段见参数说明。
	- `config.templateStr`
	   类型：String。
	   默认值: 组件默认的模板字符串，模板文件存在于`templates/mcalendar.html`中；用户可以自定义组件模板类型，用于增减页面元素。

	- `config.wrapper`
	   类型：<Element|String>，页面元素或者是元素选择器。
       说明：组件容器，用于存放日历实例。
       默认值：空，需用户指定，可选。

    - `config.valueTarget`
	   类型：<Element|String>，页面元素或者是元素选择器。
       说明：选择某个日期时，会将日期赋值给该元素，如果该元素为input，textarea，则赋值给value属性。否则赋值给元素的innerHTML属性。
	   默认值： 空，可选。

	- `config.dataFormat`
	   类型：String
       说明：填充valueTarget元素的日期格式。各个占位符意思如下： `yyyy`：年份，四位, `MM`:月份，两位, `dd`:日期，2位
       默认值：`yyyy-MM-dd`, 例如：2016-10-01。

    - `config.weekdates`
       类型：Array,
       说明：由于显示星期的名称，插件默认每周首日从周日开始。
	   默认值：["日", "一", "二", "三", "四", "五", "六"]。
	   > 此处功能待扩展
	  
    - `config.autohide`
       类型：Boolean
       说明：选中某个日期之后，是否自动关闭（不显示）日历。
	   默认值：true,默认会自动关闭。
    
    - `config.enableList`
	   类型：<Array|"all">
	   说明：指明是否所有日期是否可选。当前值为字符创`all`时，表示所有 日期均可选，如果只为数组，则表示只有数组中的日期可被选中，此时，能被选中的日期将会获得 `selectable`类用于标识突出。   
       默认值：`all`，默认所有日期均可选择。

    - `config.defaultDate`
       类型：Date
       说明：初次显示日历时，被选中的日期。
	   默认值：当前日期对象。

    - `config.toolList`
       类型：Array
	   说明：用于生成顶部工具栏的数组列表
	   结构说明：每个节点最终会生成一个a节点，插入`tool-bar`中.
       - `toolList[i].text`:节点（工具按钮）名
       - `toolList[i].className`:用户设定的类名，可用于自定义样式
	   - `toolList[i].action`:点击工具按钮时的回调函数，回参包括日历实例instance，及当前点击元素item；instance对象可调用其方法，详见下方方法说明。
	   DEMO：
       ```
	   toolList:[
			{
                text:"关闭",
                className:"closeCalendar",
                action:function(instance,item){
                    instance.hide();
                    console.log(item);
                }
            }
	   ]
       ```
	   默认值：空

    - `config.showToolBar`
       类型:Boolean
	   说明:是否显示工具栏，为true时显示，为false则不显示。
	   默认值：false,不显示工具栏
    - `config.selectDateCallback(el, dateInfo)`
       类型：Function
	   说明：选中某个日期时的回调，注意：只有当前日期可被选中时才会执行。回参包括被选中的DOM元素，dateInfo为json对象，结构如下`{date:日期对象，dateStr：符合config.dataFormat格式的日期字符串}`。
	   默认值:空。

    - `config.selectMonth(instance, monthAndYear, offset)`
       类型：Function
	   说明：切换月份时的回调函数，注意在初始化日历时也会被调用。回参包括日历实例instance，instance对象可调用其方法，详见下方方法说明。monthAndYear为json对象，包含年份及月份信息，结构为：`{month:月份，year：年份}`。offset为月份变动值，为1表示向往后推进一个月，-1表示向以前推进一个月，0表示初始化。
	   默认值:空。

#### 2. `futuCalendar#show(callback)`
#### 3. `futuCalendar#hide(callback)`
#### 4. `futuCalendar#getDateInfo()`
#### 5. `futuCalendar#goLastMonth(callback)`
#### 6. `futuCalendar#goNextMonth(callback)`
#### 7. `futuCalendar#setDate(date, callback)`
#### 8. `futuCalendar#setCliableList(list,callback)`
#### 9. `futuCalendar#getItemIndexByDate(date)`
#### 9. `futuCalendar#getItem(date)`


## 开发
1. 源码位于src/index.js，开发完成后在ui-mcalendar目录下运营`gulp`命令，生成根目录下的index.js。
2. 实例项目examples中，使用script标签的方式引入，可直接运行。
3. 依赖`underscore.js`,开发过程中已进行打包，无需重复引入

## 版本记录

### 1.0.0 2016-09-22
- 初始化版本，完成代码及文档
