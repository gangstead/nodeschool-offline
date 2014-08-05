var gulp = require('gulp');
var zip = require('gulp-zip');
var rimraf = require('rimraf');
var jeditor = require("gulp-json-editor");
var webserver = require('gulp-webserver');

gulp.task('zip_learnyounode', ['clean'], function() {
  return gulp.src('./node_modules/learnyounode/**/*')
    .pipe(zip('learnyounode.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('zip_streamadventure', ['clean'], function() {
  return gulp.src('./node_modules/stream-adventure/**/*')
    .pipe(zip('streamadventure.zip'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('move_instructions', ['clean'], function() {
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

gulp.task('update_ip', ['clean', 'get_ip'], function() {
  gulp.src('./config.json')
    .pipe(jeditor({
      'local_ip': localIP
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('run_webserver', [
  'zip_learnyounode',
  'zip_streamadventure',
  'move_instructions',
  'update_ip'], function() {
  gulp.src('./dist')
    .pipe(webserver({
      host: '0.0.0.0',
      port: 8080
    }))
});

gulp.task('default', [
  'clean',
  'zip_learnyounode',
  'zip_streamadventure',
  'move_instructions',
  'update_ip',
  'run_webserver'
]);
