var gulp = require('gulp');
var zip = require('gulp-zip');
var rimraf = require('rimraf');
var jeditor = require("gulp-json-editor");
var mustache = require("gulp-mustache");
var webserver = require('gulp-webserver');
var es = require('event-stream');
var config = require('./config.json');

gulp.watch('./templates/*.mustache', ['process_templates']);
gulp.watch('./*.txt', ['move_instructions']);
gulp.watch(['./assets/*'], ['move_static']);

gulp.task('zip_modules', function() {
  var streams = config.modules.map(function(module){
      return gulp.src('./node_modules/'+module+'/**/*')
    .pipe(zip(module+'.zip'))
  });
  return es.merge.apply(null,streams)
    .pipe(gulp.dest('./dist'));
});

gulp.task('move_instructions', function() {
  return gulp.src(['*.txt'])
      .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function(cb) {
  return rimraf('./dist', cb);
});

var local_ip;
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
        local_ip = lookupIpAddress;
        console.log('swg ip address'+local_ip);
        return;
      }
    });
  }
});

gulp.task('update_ip', ['get_ip'], function() {
  return gulp.src('./config.json')
      .pipe(jeditor(function(json){
        if(local_ip) {
          console.log('swg local ip');
          json.local_ip = local_ip;
        } else console.log('no local ip');
        return json;
      }))
      .pipe(gulp.dest('./dist'));
});

gulp.task('process_templates', ['update_ip'], function() {
  return gulp.src("./templates/*.mustache")
      .pipe(mustache('./dist/config.json',
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
  'update_ip',
  'process_templates',
  'move_static'], function() {
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
