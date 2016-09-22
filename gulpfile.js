var gulp        = require('gulp');
var gulpWebpack = require('webpack-stream');
var named       = require('vinyl-named-with-path');
var webpack     = require("webpack");

//js出错时不中断
var plumber = require('gulp-plumber');

var devConfig = {
    entry: './src/index.js',
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         drop_console: true,
        //         warnings:false
        //     }
        // })
    ],
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
            loader: 'style-loader!css-loader'
        }, {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['es2015']
            }
        }]
    },
    watch: true,
    devtool: '#source-map'
};

gulp.task('pack', function() {
    return gulp.src('./src/index.js')
        .pipe(named())
        .pipe(plumber())
        .pipe(gulpWebpack(devConfig))
        .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
    gulp.watch(['./*.js'], ['pack']);
});

gulp.task('default', function() {
    gulp.run('pack');
    gulp.run('watch');
});