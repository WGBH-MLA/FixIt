var browserify = require('browserify'),
    gulp = require('gulp'),
    babelify = require('babelify'),
    compass = require('gulp-compass');
    source = require('vinyl-source-stream'),
    paths = {
        mainJS: './front-end/javascript/main.js',
        watchJS: './front-end/javascript/*',
        mainScss: './front-end/scss/main.scss',
        sass: './front-end/scss/',
        dist: './front-end/dist/'
    };

gulp.task('js', [], function () {
    var b = browserify();
    b.transform(babelify);
    b.add(paths.mainJS);
    return b.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./front-end/dist'));
});

gulp.task('scss', function () {
    return gulp.src(paths.mainScss)
    .pipe(compass({
        css: paths.dist,
        sass: paths.sass,
        require: 'breakpoint',
        sourcemap:true
    }))
    .on('error', function (err) {
      console.error('Error: ', err.message);
    })
    // .pipe(minifyCSS())
    .pipe(gulp.dest(paths.dist));
});

gulp.task('build', ['js', 'scss'], function () {

});

gulp.task('watch', [], function () {
    gulp.watch(paths.watchJS, ['js']);
    gulp.watch(paths.sass + '*', ['scss']);
});

gulp.task('default', ['build', 'watch'], function () {

});
