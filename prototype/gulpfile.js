'use strict';

var gulp = require('gulp'),
    chalk = require('chalk'),
    gulpif = require('gulp-if'),
    open = require('open'),
    fileInclude = require('gulp-file-include'),
    runSequence = require('run-sequence'),
    stylish = require('jshint-stylish'),
    del = require('del'),
    sass = require('gulp-sass'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    autoprefixer = require('gulp-autoprefixer'),
    plugins = require('gulp-load-plugins')();

//src path
var src = {
    root: 'src',
    css: 'src/css',
    includes: 'src/includes',
    scss: 'src/scss',
    js: 'src/js',
    sass: './sass',
    img: 'src/img',
    fonts: 'src/fonts',
    html: 'build',
    buildJs: './build/assets/js',
    buildCss: './build/assets/css',
    buildImg: './build/assets/img',
    buildFonts: './build/assets/fonts',
    portJs: '../build/themes/magapoka/assets/js',
    portCss: '../build/themes/magapoka/assets/css',
    portImg: '../build/themes/magapoka/assets/img'
};

var production = false;

var opts = {
    comments: false,
    quotes: true,
    spare: true,
    empty: true,
    cdata: true
};

// chalk config
var error = chalk.red.bold,
    hint = chalk.yellow.bold,
    change = chalk.red;

/**
 * Log changes in console
 */
var log = function (event) {
    console.log(change('\n -- File ' + event.path + ' was ' + event.type + ' -->>>'));
};

/**
 * Task: Individually build SASS files
 */
gulp.task('build-sass', function() {
    return gulp.src([src.scss + '/prototype.scss', src.scss + '/prototype.sass'])
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer('last 10 versions'))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(src.buildCss))
        .pipe(gulp.dest(src.portCss))
});

/**
 * Task: Individually build HTML files
 */
gulp.task('build-html', function () {
    return gulp.src([src.root + '/*.html', src.root + '/**/*.html'])
        .pipe(fileInclude({
            prefix: '@@',
            basepath: src.includes
        }))
        .pipe(gulp.dest(src.html))
});

/**
 * Task: Individually build JS files
 */
gulp.task('build-js', function () {
    console.log(hint('\n --------- Running SCRIPT tasks ----------------------------------------->>>'));
    return gulp.src([src.js + '/*.js', src.js + '/**/*.js'])
        .pipe(plugins.jshint('.jshintrc'))
        .pipe(plugins.jshint.reporter(stylish))
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.size())
        .pipe(gulp.dest(src.buildJs))
        .pipe(gulp.dest(src.portJs))
});


/**
 * Task: Copy images to build and public folder
 */
gulp.task('build-img', function() {
    return gulp.src([src.img + '/*', src.img + '/**/*'])
        .pipe(gulp.dest(src.buildImg))
        .pipe(gulp.dest(src.portImg))
});


/**
* Task: Copy fonts to the build and public folder
*/

gulp.task('build-fonts', function() {
    return gulp.src([src.fonts + '/*', src.fonts + '/**/*'])
        .pipe(gulp.dest(src.buildFonts))
});


/**
 * Task: Individually Watch JS
 */
gulp.task('watch-js', function () {
    console.log(hint('\n --------- Watching JS Files ------------------------------------------->>> \n'));
    gulp
    .watch([src.root + '/*.js', src.js + '/**/*.js'], ['build-js'])
    .once('change', log);
});

/**
 * Task: Individually Watch SASS
 */
gulp.task('watch-sass', function () {
    console.log(hint('\n --------- Watching SASS Files ------------------------------------------->>> \n'));
    gulp
    .watch([src.root + '/*.scss', src.scss + '/**/*.scss', src.root + '/*.sass', src.scss + '/**/*.sass'], ['build-sass'])
    .once('change', log);
});

/**
 * Task: Individually Watch HTML
 */
gulp.task('watch-html', function () {
    console.log(hint('\n --------- Watching HTML Files ------------------------------------------->>> \n'));
    gulp
    .watch([src.root + '/*.html', src.root + '/**/*.html', src.root + '/*.php', src.includes + '/**/*.php'], ['build-html'])
    .once('change', log);
});

/**
 * Task: Individually Watch IMG
 */
gulp.task('watch-img', function () {
    console.log(hint('\n --------- Watching IMG Files ------------------------------------------->>> \n'));
    gulp
    .watch([src.root + '/*.jpg', src.root + '/*.png', src.root + '/*.svg', src.root + '/*.gif', src.root + '/**/*.jpg', src.root + '/**/*.png', src.root + '/**/*.svg', src.root + '/**/*.gif',], ['build-img'])
    .once('change', log);
});

/**
 * Task: Clean 
 */
gulp.task('clean', function () {
    console.log(hint('\n --------- Clean:Build Folder ------------------------------------------>>> \n'));
    del('build/', function (err) {
        console.log(hint('All are files deleted from the build folder'));
    });
});

/** 
 * Task: Build 
 */
gulp.task('build', function () {
    console.log(hint('\n --------- Build Development Mode  -------------------------------------->>> \n'));
    runSequence('build-sass', 'build-js', 'build-html', 'build-img', 'build-fonts');
});

/** 
 * Task: Default 
 */
gulp.task('default', ['build']);

/**
 * Task: Watch all 
 */
gulp.task('watch', ['watch-js', 'watch-sass', 'watch-html', 'watch-img']);