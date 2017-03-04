// gulp
var gulp = require('gulp');

// plugins
var clean = require('gulp-clean');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');
var minifyCSS = require('gulp-clean-css');

// lint task
gulp.task('lint', function () {
    return gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
	.pipe(jshint.reporter('fail'));
});

// clean task
gulp.task('clean', function () {
    return gulp.src('./dist/*').pipe(clean({
	force: true
    }));
});

// minify css and copy to dist task
gulp.task('minify-css', function () {
    var opts = {
	comments:true,
	spare:true
    };
    return gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
	.pipe(minifyCSS(opts))
	.pipe(gulp.dest('./dist/'));
});

// minify js and copy to dist task
gulp.task('minify-js', function () {
    return gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
	.pipe(uglify({
	    // inSourceMap:
	    // outSourceMap: "app.js.map"
	}))
	.pipe(gulp.dest('./dist/'));
});

// copy bower components to dist task
gulp.task('copy-bower-components', function () {
    return gulp.src('./app/bower_components/**')
	.pipe(gulp.dest('dist/bower_components'));
});

// copy html to dist task
gulp.task('copy-html-files', function () {
    return gulp.src('./app/**/*.html').pipe(gulp.dest('dist/'));
});

// copy images to dist task
gulp.task('copy-image-files', function () {
    return gulp.src('./app/images/**').pipe(gulp.dest('dist/images'));
});

// copy subscribe task
gulp.task('copy-subscribe', function () {
    return gulp.src('./app/subscribe').pipe(gulp.dest('dist/'));
});

// build task
gulp.task('build', function () {
    return runSequence('clean', [
	'lint',
	'minify-css',
	'minify-js',
	'copy-html-files',
    'copy-image-files',
    'copy-subscribe',
	'copy-bower-components']);
});

// server task
gulp.task('server', function () {
    return connect.server({
	root: 'app/',
	port: 8888
    });
});

// dist server task
gulp.task('dserver', function () {
    return connect.server({
	root: 'dist/',
	port: 9999
    });
});

// default task
gulp.task('default', ['lint', 'server']);

// aws s3 sync dist s3://morganhivebe.com --delete
