var gulp = require('gulp');
var zip = require('gulp-zip');
var rimraf = require('rimraf');
var jeditor = require("gulp-json-editor");
var mustache = require("gulp-mustache");
var webserver = require('gulp-webserver');

var wifi_ssid = 'this_ssid';
var wifi_pw = 'password';



gulp.watch('./templates/*.mustache', ['process_templates']);
gulp.watch('./instructions.txt', ['move_instructions']);
gulp.watch(['./*.css', './*.png'], ['move_static']);


gulp.task('zip_learnyounode', function() {
  return gulp.src('./node_modules/learnyounode/**/*')
      .pipe(zip('learnyounode.zip'))
      .pipe(gulp.dest('./dist'));
});

gulp.task('zip_streamadventure', function() {
  return gulp.src('./node_modules/stream-adventure/**/*')
      .pipe(zip('streamadventure.zip'))
      .pipe(gulp.dest('./dist'));
});

gulp.task('move_instructions', function() {
  return gulp.src(['instructions.txt'])
      .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function(cb) {
  return rimraf('./dist', cb);
});

var localIP = '1.1.1.1';
gulp.task('get_ip', function() {
  var os=require('os');
  var ifaces=os.networkInterfaces();
  var lookupIpAddress = null;
  for (var dev in ifaces) {
    if(dev != "en1" && dev != "en0") {
        continue;
    }
    ifaces[dev].forEach(function(details){
      if (details.family=='IPv4') {
        lookupIpAddress = details.address;
        localIP = lookupIpAddress;
        return;
      }
    });
  }
});

gulp.task('update_ip', ['get_ip'], function() {
  return gulp.src('./config.json')
      .pipe(jeditor({
        'local_ip': localIP
      }))
      .pipe(gulp.dest('./dist'));
});

gulp.task('process_templates', function() {
  return gulp.src("./templates/*.mustache")
      .pipe(mustache({
          wifi_ssid: wifi_ssid,
          wifi_pw: wifi_pw,
          ip: localIP
      },
      {
        extension: '.html'
      }))
      .pipe(gulp.dest("./dist"));
});

gulp.task('move_static', function() {
  return gulp.src(['./*.css', './*.png'])
      .pipe(gulp.dest("./dist"));
});

gulp.task('run_webserver', [
  'zip_learnyounode',
  'zip_streamadventure',
  'move_instructions',
  'process_templates',
  'move_static',
  'update_ip'], function() {
  return gulp.src('./dist')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 80
    }))
});


gulp.task('default', [
  'zip_learnyounode',
  'zip_streamadventure',
  'move_instructions',
  'update_ip',
  'run_webserver'
]);
