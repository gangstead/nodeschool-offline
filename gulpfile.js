var gulp = require('gulp');
var zip = require('gulp-zip');
var rimraf = require('rimraf');
var jeditor = require("gulp-json-editor");
var mustache = require("gulp-mustache");
var webserver = require('gulp-webserver');
var es = require('event-stream');

var wifi_ssid = 'CREDERA-GUEST';
var wifi_pw = 'I forgot to update the secret password in the gulpfile';


gulp.watch('./templates/*.mustache', ['process_templates']);
gulp.watch('./instructions.txt', ['move_instructions']);
gulp.watch(['./assets/*'], ['move_static']);

var modules = [ 'learnyounode',
                'stream-adventure',
                'javascripting'];

gulp.task('zip_modules', function() {
  var streams = modules.map(function(module){
    return gulp.src('./node_modules/'+module+'/**/*')
    .pipe(zip(module+'.zip'))
  });
  return es.merge.apply(null,streams)
    .pipe(gulp.dest('./dist'));
});

gulp.task('move_instructions', function() {
  return gulp.src(['instructions.txt'])
      .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function(cb) {
  return rimraf('./dist', cb);
});

var localIP = '192.168.67.99';
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
  return gulp.src(['./assets/*'])
      .pipe(gulp.dest("./dist"));
});

gulp.task('run_webserver', [
  'zip_modules',
  'move_instructions',
  'process_templates',
  'move_static',
  'update_ip'], function() {
  return gulp.src('./dist')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 3000
    }))
});


gulp.task('default', [
  'zip_modules',
  'move_instructions',
  'update_ip',
  'run_webserver'
]);
