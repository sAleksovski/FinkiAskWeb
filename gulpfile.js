var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var rev = require('gulp-rev-append');
var eslint = require('gulp-eslint');
var connect = require('gulp-connect');
var fs = require("fs");
var rebaseUrls = require('gulp-css-rebase-urls');


var CSS_LIB = [
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'bower_components/bootstrap-material-design/dist/css/roboto.min.css',
    'bower_components/bootstrap-material-design/dist/css/ripples.min.css',
    'bower_components/bootstrap-material-design/dist/css/material.min.css'
];

var CSS_APP = [
    'css/style.css'
];

var JS_LIB = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap-material-design/dist/js/material.js',
    'bower_components/nouislider/jquery.nouislider.min.js',
    'bower_components/angular/angular.min.js',
    'bower_components/angular-route/angular-route.min.js',
    'bower_components/angular-cookies/angular-cookies.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'bower_components/angular-nouislider/src/nouislider.min.js',
    'bower_components/angular-svg-round-progressbar/build/roundProgress.min.js',
    'bower_components/angular-touch/angular-touch.min.js',
];

var JS_APP = [
    'js/**/*.js'
];


/**
*   The location of the resources for deploy
*/
var DESTINATION = 'dest/';
/**
* The single page initial html file. It will be altered 
* by this script.
*/
var INDEX_FILE = 'index.html';
/**
* The name of the angular module
*/
var  MODULE_NAME = 'finkiAskApp';
/**
* The URL of the back-end API
*/
var API_URL = 'http://192.168.1.67:8080';
/**
* Route to which the API calls will be mapped 
*/
var API_ROUTE = '';

/**
* Task for concatenation of the js libraries used 
* in this project 
*/
gulp.task('concat_js_lib', function () {
    return gulp.src(JS_LIB) // which js files
        .pipe(concat('lib.js')) // concatenate them in lib.js
        .pipe(gulp.dest(DESTINATION)) // save lib.js in the DESTINATION folder
});

/**
* Task for concatenation of the css libraries used 
* in this project 
*/
gulp.task('concat_css_lib', function () {
    return gulp.src(CSS_LIB) // which css files
        .pipe(concat('lib.css')) // concat them in lib.css
        .pipe(gulp.dest(DESTINATION)) // save lib.css in the DESTINATION folder
});

/**
* Task for concatenation of the js code defined  
* in this project 
*/
gulp.task('concat_js_app', function () {
    return gulp.src(JS_APP)
        .pipe(concat('src.js'))
        .pipe(gulp.dest(DESTINATION))
});

/**
* Task for concatenation of the css code defined 
* in this project 
*/
gulp.task('concat_css_app', function () {
    return gulp.src(CSS_APP)
        .pipe(rebaseUrls())
        .pipe(concat('app.css'))
        .pipe(gulp.dest(DESTINATION))
});

/**
* Task for concatenation of the html templates defined 
* in this project 
*/
gulp.task('templates', function () {
    return gulp.src('views/**/**.html') // which html files
        .pipe(
            templateCache('templates.js', { // compile them as angular templates 
                module: MODULE_NAME,        // from module MODULE_NAME 
                root: 'app'                 // of the app
            })) 
        .pipe(gulp.dest(DESTINATION));
});

/**
* Task for adding the revision as parameter   
* for cache braking
*/
gulp.task('cache-break', function () {
    return gulp.src(INDEX_FILE) // use the INDEX_FILE as source
        .pipe(rev())            // append the revision to all resources
        .pipe(gulp.dest('.'));  // save the modified file at the same destination
});

var tasks = [
    'concat_js_lib',
    'concat_css_lib',
    'concat_js_app',
    'concat_css_app',
    'templates'
];

gulp.task('build', tasks, function () {
    gulp.start('cache-break');
});

gulp.task('watch', function () {
    gulp.watch('app/**/**.js', ['concat_js_app', 'cache-break']);
    gulp.watch('views/**/**.html', ['templates', 'cache-break']);
    gulp.watch('css/**/**.css', ['concat_css_app', 'cache-break']);
});

gulp.task('serve', function () {
    connect.server({
        port: 8000,
        livereload: true,
        middleware: function (connect, opt) {
            return [
                (function () {
                    var url = require('url');
                    var proxy = require('proxy-middleware');
                    var options = url.parse(API_URL);
                    options.route = API_ROUTE;
                    return proxy(options);
                })()
            ];
        }
    });
});

gulp.task('default', ['serve', 'watch']);
