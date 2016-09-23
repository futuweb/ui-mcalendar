var gulp        = require('gulp');
var gulpWebpack = require('webpack-stream');
var named       = require('vinyl-named-with-path');
var webpack     = require("webpack");
var extend      = require('extend');

//js出错时不中断
var plumber = require('gulp-plumber');

var devConfig = {
    entry: './src/index.js',
    output: {
        library: 'futuCalendar',
        libraryTarget: 'umd',
        filename: './indexCss.js'
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

gulp.task('watch', function() {
    gulp.watch(['./*.js'], ['pack']);
});

/*开发，默认*/
gulp.task('default', function() {
    gulp.run('pack');
    gulp.run('watch');
});

/*发布*/
gulp.task('prod', function() {
    gulp.run('prodpack');
    gulp.run('watch');
});