var path = require('path');
var gulp = require('gulp');
var	sass = require('gulp-sass');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var bust = require('gulp-buster');
var spawn = require('child_process').spawn;
var node, env = process.env;

// ---------------- Build Stuff Tasks ---------------- //
gulp.task('build-sass', function () {
	gulp.src(path.join(__dirname, '/scss/*.scss'))
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(path.join(__dirname,'/scss/temp')))			//build them here first
		.pipe(concat('main.css'))									//concat them all
		.pipe(gulp.dest(path.join(__dirname, '/public/css')))
		.pipe(cleanCSS())											//minify
		.pipe(rename('main.min.css'))
		.pipe(gulp.dest(path.join(__dirname,'/public/css')))		//dump it here
		.pipe(rename('singlecsshash'))
		.pipe(bust({fileName: 'busters_css.json'}))					//cache bust
		.pipe(gulp.dest('.'));										//dump busters_css.json
});

gulp.task('build-js-hash', function () {
	gulp.src(path.join(__dirname,'/public/js/*.js'))
		.pipe(concat('singlejshash'))								//concat them all
		.pipe(bust({fileName: 'busters_js.json'}))					//cache bust
		.pipe(gulp.dest('.'));										//dump busters_js.json
});


// ---------------- Run Application Task ---------------- //
gulp.task('server', function(a, b) {
	console.log('\n\nGulp Task - server');
	if(node) node.kill();
	node = spawn('node', ['app.js'], {env: env, stdio: 'inherit'});	//command, file, options
	return;
});


// ---------------- Watch for Changes Tasks ---------------- //
gulp.task('watch-sass', ['build-sass'], function () {
	gulp.watch(path.join(__dirname, '/scss/*.scss'), ['build-sass']);
});

gulp.task('watch-js', ['build-js-hash'], function () {
	gulp.watch(path.join(__dirname,'/public/js/*.js'), ['build-js-hash']);
});

gulp.task('watch-server', function () {
	gulp.watch(path.join(__dirname, '/routes/**/*.js'), ['server']);
	gulp.watch([path.join(__dirname, '/utils/*.js')], ['server']);
	gulp.watch([path.join(__dirname, '/utils/marbles_cc_lib/*.js')], ['server']);
	gulp.watch(path.join(__dirname, '/app.js'), ['server']);
});


// ---------------- Gulp Tasks ---------------- //
gulp.task('default', ['watch-sass', 'watch-js', 'watch-server', 'server']);	//run with command `gulp`
gulp.task('marbles', ['start_marbles', 'default']);							//run with command `gulp marbles` [THIS ONE!]
gulp.task('united_marbles', ['start_mtc1', 'default']);						//run with command `gulp united_marbles`
gulp.task('marble_market', ['start_mtc2', 'default']);						//run with command `gulp marble_market`
gulp.task('emarbles', ['start_mtc3', 'default']);							//run with command `gulp emarbles`

//generic marbles
gulp.task('start_marbles', function () {
	env['creds_filename'] = 'mycreds.json';
	console.log('\n[International Marbles Trading Consortium]\n');
});

// IMTC Member 1
gulp.task('start_mtc1', function () {
	console.log('\n[International Marbles Trading Consortium] - Member "United Marbles"\n');
	env['creds_filename'] = 'creds_united_marbles.json';
});

// IMTC Member 2
gulp.task('start_mtc2', function () {
	console.log('\n[International Marbles Trading Consortium] - Member "Marble Market"\n');
	env['creds_filename'] = 'creds_marble_market.json';
});

// IMTC Member 3
gulp.task('start_mtc3', function () {
	console.log('\n[International Marbles Trading Consortium] - Member "eMarbles"\n');
	env['creds_filename'] = 'creds_emarbles.json';
});
