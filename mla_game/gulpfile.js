var browserify = require('browserify'),
    gulp = require('gulp'),
    babelify = require('babelify'),
    sass = require('gulp-ruby-sass'),
    source = require('vinyl-source-stream'),
    paths = {
        mainJS: './global-static/javascript/main.js',
        watchJS: './global-static/javascript/*',
        mainScss: './global-static/scss/main.scss',
        watchScss: './global-static/scss/**'
    };

gulp.task('js', [], function () {
    var b = browserify();
    b.transform(babelify);
    b.add(paths.mainJS);
    return b.bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./global-static/dist'));
});

gulp.task('scss', function () {
    return sass(paths.mainScss, {
        require: 'breakpoint',
        compass: true
    })
    .on('error', function (err) {
        console.error('Error: ', err.message);
    })
    .pipe(gulp.dest('./global-static/dist'));
});

gulp.task('build', ['js', 'scss'], function () {

});

gulp.task('watch', [], function () {
    gulp.watch(paths.watchJS, ['js']);
    gulp.watch(paths.watchScss, ['scss']);
});

gulp.task('default', ['build', 'watch'], function () {

});
