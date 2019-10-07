const gulp = require('gulp');
const concat = require('gulp-concat');
const browsersync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const coffee = require('gulp-coffee');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const beautify = require('gulp-html-beautify');

function clear() {
    return gulp.src('./dist/*')
    .pipe(clean('./dist/*'))
    .pipe(gulp.dest('./dist'));
}

function image() {
    return gulp.src('./src/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./dist/img'));
}

function css() {
    return gulp.src('./src/sass/**/*.scss')
    // .pipe(plumber())
	// .pipe(coffee())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    // .pipe(console.log(sass.logError))
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 99 versions'],
        cascade: false
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./dist/css'))
    // .pipe(browsersync.stream());
}

function browserSync() {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 8080,
        startPath: './index.html',
    });
    gulp.watch("src/**/*.*").on('change', browsersync.reload);
}

function html() {
    return gulp.src('./src/html/**/*.html')
    .pipe(beautify())
    // .pipe(plumber())
	// .pipe(coffee())
    .pipe(gulp.dest('./'));
}

function js() {
    return gulp.src('./src/js/*.js')
    // .pipe(plumber())
	// .pipe(coffee())
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./dist/js'));
}

function pluginsjs() {
    return gulp.src(['./src/plugins/js/jquery.js', './src/plugins/js/pooper.js', './src/plugins/js/bootstrap.js', './src/plugins/js/vue.js'])
    // .pipe(plumber())
	// .pipe(coffee())
    .pipe(sourcemaps.init())
    .pipe(concat('plugins.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./dist/plugins/js'))
}

function pluginscss() {
    return gulp.src(['./src/plugins/css/bootstrap.css', './src/plugins/css/font-awesome.css'])
    .pipe(sourcemaps.init())
    .pipe(concat('plugins.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('./dist/plugins/css'));
}

function fonts() {
    return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts'));
}

function pluginsfonts() {
    return gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
    .pipe(gulp.dest('./dist/plugins/webfonts'));
}

function watch() {
    gulp.watch('src/html/*.html', html);
    gulp.watch( 'src/sass/*.scss', css);
    gulp.watch('src/js/*.js', js);
    //gulp.watch('src/plugins/js*.js', pluginsjs);
    //gulp.watch('src/plugins/css/*.css', pluginscss);
    gulp.watch('src/img/*', image);
}

const build = gulp.series(clear, css, fonts, html, js, image, pluginsjs, pluginscss, pluginsfonts);

exports.default = gulp.series(build, gulp.parallel(watch, browserSync));