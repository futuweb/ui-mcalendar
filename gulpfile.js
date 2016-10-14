var gulp        = require('gulp');
var gulpWebpack = require('webpack-stream');
var named       = require('vinyl-named-with-path');
var webpack     = require("webpack");
var extend      = require('extend');
var clean       = require('gulp-clean');

//js出错时不中断
var plumber = require('gulp-plumber');

var devConfig = {
    entry: './src/index.js',
    output: {
        library: 'futuCalendar',
        libraryTarget: 'umd',
        filename: './index.js'
    },
    resolve: {
        modulesDirectories: ["./node_modules"]
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'text'
        }, {
            test: /\.css$/,
            exclude: "./node_modules",
            loader: 'style-loader!css-loader'
        }, {
            test: /\.js?$/,
            exclude: "./node_modules",
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    watch: true,
    devtool: '#source-map'
};

var prodConfig = extend({},devConfig,{
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                drop_console: true,
                warnings:false
            }
        }),
    ],
    watch:false
});

var cssConfig = extend({},devConfig,{
    entry: ['./src/ui-mcalendar.css','./src/index.js'],
    output: {
        library: 'futuCalendar',
        libraryTarget: 'umd',
        filename: './indexCss.js'
    },
    watch:false
});

var prodcssConfig = extend({},prodConfig,{
    entry: ['./src/ui-mcalendar.css','./src/index.js'],
    output: {
        library: 'futuCalendar',
        libraryTarget: 'umd',
        filename: './indexCss.js'
    },
    watch:false
});

gulp.task('pack', function() {
    return gulp.src('./src/index.js')
        .pipe(named())
        .pipe(plumber())
        .pipe(gulpWebpack(devConfig))
        .pipe(gulp.dest('./'));
});

gulp.task('prodpack', function() {
    return gulp.src('./src/index.js')
        .pipe(named())
        .pipe(plumber())
        .pipe(gulpWebpack(prodConfig))
        .pipe(gulp.dest('./'));
});

//  包含css的打包
gulp.task('packwithCss', function() {
    return gulp.src('./src/index.js')
        .pipe(named())
        .pipe(plumber())
        .pipe(gulpWebpack(cssConfig))
        .pipe(gulp.dest('./'));
});

//  包含css的打包
gulp.task('prodpackwithCss', function() {
    return gulp.src('./src/index.js')
        .pipe(named())
        .pipe(plumber())
        .pipe(gulpWebpack(prodcssConfig))
        .pipe(gulp.dest('./'));
});

gulp.task('clean', function() {
    return gulp.src('./index**', {
        read: false
    }).pipe(clean());
});

gulp.task('watch', function() {
    gulp.watch(['./*.js'], ['pack']);
});

/*开发，默认*/
gulp.task('default', function() {
    gulp.run('clean');
    gulp.run('pack');
    gulp.run('packwithCss');
    gulp.run('watch');
});

/*发布*/
gulp.task('prod', function() {
    gulp.run('clean');
    gulp.run('prodpack');
    gulp.run('prodpackwithCss');
});