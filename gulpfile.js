var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var webpackConfigDist = require("./webpack.prod.config.js");
var clean = require('gulp-clean');
var open = require("open");
var runSequence = require('run-sequence');

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task("build-dev", ["webpack:build-dev"], function () {
    gulp.watch(["app/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build-prod"]);
gulp.task("build-dev", ["webpack:build-dev"]);
gulp.task("build-prod", ["webpack:build-prod"]);

gulp.task("clean-dist", function (cb) {
    gulp.src(['./dist/**/*', '!./dist/.git/**/*']).pipe(clean()).on('finish', cb)
});

gulp.task("copy-src", function () {
    gulp.src(['src/**/*']).pipe(gulp.dest('./dist/src'))
});

gulp.task("build-all", function (callback) {
    runSequence("clean-dist", ["build-dev", "build-prod"], "copy-src", callback)
});

gulp.task("clean-prod-dist", function () {
    gulp.src('./dist/prod').pipe(clean());
});

gulp.task("webpack:build-prod", ['clean-prod-dist'], function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfigDist);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-prod", err);
        gutil.log("[webpack:build-prod]", stats.toString({
            colors: true
        }));
        gulp.src([ '!src/scripts/**', 'src/**/*']).pipe(gulp.dest('./dist/prod'));
        callback();
    });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = "sourcemap";
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task("cleandevdist", function () {
    gulp.src('./dist/dev').pipe(clean());
});


gulp.task("webpack:build-dev", ['cleandevdist'], function (callback) {
    // run webpack
    devCompiler.run(function (err, stats) {
        if (err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        gulp.src([ '!src/scripts/**', 'src/**/*']).pipe(gulp.dest('./dist/dev'));
        callback();
    });
});

gulp.task("webpack-dev-server", function (callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(myConfig), {
        publicPath: '/scripts/',
        contentBase: './src/',
        stats: {
            colors: true
        }
    }).listen(8080, "localhost", function (err) {
            if (err) throw new gutil.PluginError("webpack-dev-server", err);

            open("http://localhost:8080/webpack-dev-server/index.html");

            gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
        });
});

// Handle the error
function errorHandler (error) {
    console.log(error.toString());
    this.emit('end');
}
