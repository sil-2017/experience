const gulp = require('gulp'),
    pug = require('gulp-pug'),
    sass = require("gulp-sass"),
    imagemin = require("gulp-imagemin"),
    browsersync = require("browser-sync"),
    rename = require("gulp-rename");

    function pugCompile(){
        return gulp.src('./src/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(rename('pugIndex.html'))
        .pipe(gulp.dest('./dist/'))
        .pipe(browsersync.stream())
    }

    function images(){
        return gulp.src("./src/img/*.{jpg,png,svg}")
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ]
        }))
        .pipe(gulp.dest('./dist/img/'))
        .pipe(browsersync.stream())
    }

    function css(){
        return gulp.src("./src/sass/style.scss")
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest("./dist/"))
        .pipe(browsersync.stream())
    }

    function browserSync(params){
        browsersync.init({
            server:{
                baseDir:'./dist/',
            },
            index: "pugIndex.html"
        });
    }

    function watchFiles(params){
        gulp.watch(['./src/**/*.pug'], pugCompile);
        gulp.watch(["./src/sass/style.scss"], css);
        gulp.watch(["./src/img/*.{jpg,png,svg}"], images);
    }

    let build = gulp.series(css,pugCompile,images);
    let watch = gulp.parallel(build,watchFiles,browserSync);

    exports.images = images;
    exports.css = css;
    exports.pugCompile = pugCompile;
    exports.build = build;
    exports.watch = watch;
    exports.default = watch;