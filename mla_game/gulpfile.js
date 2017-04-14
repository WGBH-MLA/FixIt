var browserify = require('browserify'),
    gulp = require('gulp'),
    babelify = require('babelify'),
    compass = require('gulp-compass'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify');
    pump = require('pump');
    paths = {
        indexJS: './front-end/javascript/index.js',
        buildindexJS: './front-end/dist/index.js',
        watchJS: './front-end/javascript/**/*.js',
        mainScss: './front-end/scss/main.scss',
        sass: './front-end/scss/',
        dist: './front-end/dist/'
    };

gulp.task('js', [], function(){
    var b = browserify();
    b.transform(babelify);
    b.add(paths.indexJS);
    return b.bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('./front-end/dist'));
});

gulp.task('compass', function(){
    return gulp.src(paths.mainScss)
    .pipe(compass({
        css: paths.dist,
        sass: paths.sass,
        require: 'breakpoint',
        sourcemap:true,
        style:'compressed'
    }))
    .on('error', function (err) {
      console.error('Error: ', err.message);
    })
    .pipe(gulp.dest(paths.dist));
});

gulp.task('compress', function (cb) {
  process.stdout.write("Setting NODE_ENV to 'production'" + "\n");
  process.env.NODE_ENV = 'production';
  if (process.env.NODE_ENV != 'production') {
    throw new Error("Failed to set NODE_ENV to production!!!!");
  } else {
    process.stdout.write("Successfully set NODE_ENV to production" + "\n");
  }
  pump([
    gulp.src(paths.buildindexJS),
    uglify(),
    gulp.dest(paths.dist)
    ],
    cb
  );
});

gulp.task('build', ['js', 'compass'], function (){
  process.env.NODE_ENV = 'development';
});

gulp.task('watch', [], function(){
    gulp.watch(paths.watchJS, ['js']);
    gulp.watch(paths.sass + '*', ['compass']);
});

gulp.task('production_build', ['build', 'compress']);

gulp.task('default', ['build', 'watch'], function () {

});
