'use strict';

var gulp = require('gulp'),
	fileinclude = require('gulp-file-include'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	del = require("del"),
	browser = require('browser-sync').create(),
	reload = browser.reload;

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: {
		html: ['src/*.html','src/**/*.html'],
		js: ['src/js/**.js','src/js/**/**.js'],
		style: 'src/sass/**.scss',
		img: ['src/img/*.*','src/img/**/*.*'],
		fonts: 'src/fonts/**/*.*'
	},
	watch: {
		html: ['src/*.html','src/**/*.html'],
		js: ['src/js/**.js','src/js/**/**.js'],
		style: ['src/sass/**.scss','src/sass/**/*.scss','src/sass/**/**/*.scss'],
		img: ['src/img/*.*','src/img/**/*.*'],
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build'
};

// =======================================
// 서버 시작 후 watch 업무
// =======================================
function webServer() {
	browser.init({
		server: {
			baseDir: "./build"
		},
		tunnel: false,
		host: 'localhost',
		port: 9000,
		
	//	logPrefix: "sookidak"
	});
	gulp.watch(path.watch.style, gulp.parallel(styleBuild)).on('change', browser.reload);
	gulp.watch(path.watch.js, gulp.parallel(jsBuild)).on('change', browser.reload);
	gulp.watch(path.watch.img, gulp.parallel(imageBuild)).on('change', browser.reload);
	gulp.watch(path.watch.fonts, gulp.parallel(fontsBuild)).on('change', browser.reload);
	gulp.watch(path.watch.html, gulp.parallel(htmlBuild)).on('change', browser.reload);
};

function clean() {
	return del(['./build/']);
};

function htmlBuild() {
	return gulp.src(path.src.html)
		.pipe(fileinclude({
			prefix: '@@',
      		basepath: '@file'
		}))
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(browser.reload({ stream : true }));
};

function jsBuild() {
	return gulp.src(path.src.js) 
		//.pipe(rigger()) 
		//.pipe(sourcemaps.init()) 
		//.pipe(uglify()) 
		//.pipe(sourcemaps.write()) 
		.pipe(gulp.dest(path.build.js))
		.pipe(browser.reload({ stream : true }));
};

function styleBuild() {
	return gulp.src(path.src.style) 
		//.pipe(sourcemaps.init())
		.pipe(sass({
			sourceMap: true,
			errLogToConsole: true
		}))
		//.pipe(prefixer())
		//.pipe(cssmin())
		//.pipe(sourcemaps.write())
		.pipe( rename('common.css') )
		.pipe(gulp.dest(path.build.css))
		.pipe(browser.reload({ stream : true }));
};

function imageBuild() {
	return gulp.src(path.src.img) 
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(browser.reload({ stream : true }));
};

function fontsBuild() {
   return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
};

gulp.task('serve', gulp.series(clean,
  gulp.parallel(
	styleBuild, 
	htmlBuild, 
	fontsBuild, 
	imageBuild, 
	jsBuild),
webServer ));

gulp.task('default', gulp.series('serve'));