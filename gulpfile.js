'use strict';

const { parallel, series } = require('gulp');
const gulp = require('gulp'),
      sass = require('gulp-sass')(require('sass')),
      rename = require('gulp-rename'),
      browserSync = require('browser-sync').create(),
      uglify = require('gulp-uglify'),
    //   watch = require('gulp'),
      autoprefixer = require('gulp-autoprefixer'),
	  postcss = require('gulp-postcss'),
	  cssnano = require('cssnano'),
	  concat = require('gulp-concat');

function goSass() {
	return gulp.src('app/scss/style.scss')
		.pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(rename({suffix: ".min"}))
		.pipe(autoprefixer({
			cascade: false,
			overrideBrowserslist: 'last 8 version'
		}))
		.pipe(gulp.dest('app/css'))
};

function sync() {
	browserSync.init({ server: { baseDir: './app' } });
	gulp.watch("app/*.html").on('change', browserSync.reload);
	gulp.watch("app/js/main.js" , parallel(minJs)).on('change', browserSync.reload);
	gulp.watch("app/scss/style.scss" , parallel(goSass)).on('change', browserSync.reload);
}

function minJs(){
	return gulp.src('app/js/main.js')
		.pipe(uglify())
		.pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest('app/js'));
}

function libJS(){
	return gulp.src(''),
		   gulp.src('')
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
}

function libCSS(){
	return gulp.src('node_modules/normalize.css/normalize.css')
	.pipe(concat('libs.min.css'))
	.pipe(postcss(cssnano))
	.pipe(gulp.dest('app/css'))
}


exports.sass = goSass;
exports.libJS = libJS;
exports.libCSS = libCSS;
exports.default = parallel(sync, libCSS);