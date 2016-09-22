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
1. 引入样式文件，或者自定义样式 
```
<link rel="stylesheet" type="text/css" href="ui-mcalendar/src/ui-mcalendar.css"/>
```
2. 引入js，以直接引入为例
```
<script type="text/javascript" src="ui-mcalendar/index.js"></script>
```
3. 实例化插件
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

## API
### `futuCalendar(config)`
构造函数，参数：

- `config`: 日历配置相关参数，json对象，具体字段见参数说明。

## 开发
1. 源码位于src/index.js，开发完成后在ui-mcalendar目录下运营`gulp`命令，生成根目录下的index.js。
2. 实例项目examples中，使用script标签的方式引入，可直接运行。
3. 依赖`underscore.js`,开发过程中已进行打包，无需重复引入

## 版本记录

### 1.0.0 2016-09-22
- 初始化版本，完成代码及文档
