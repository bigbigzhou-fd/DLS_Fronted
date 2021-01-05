
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = plugins = gulpLoadPlugins();
var autoprefixer = require('gulp-autoprefixer');
// var templates = require('gulp-angular-templatecache');//Concatenates and registers AngularJS templates in the $templateCache.
var ngHtml2Js = require("gulp-ng-html2js");
var htmlMinify = require('gulp-htmlmin');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');//Minify JavaScript with UglifyJS2.
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var jshint = require('gulp-jshint');    //jshint检测javascript的语法错误
var useref = require('gulp-useref');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var rename = require("gulp-rename");
const babel = require('gulp-babel');

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var assetRev = require('gulp-asset-rev')
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector');;

var url = require('url');
var mockApi = require('./mockAPI');

var distFolderUrl = "userAppDist"
gulp.task('clean', function () {
  return require('del')([distFolderUrl + '/**','tmp/**','dist/**']);
});


gulp.task('templatesTpls', function () {
  return gulp.src([
      './app/src/directives/tpls/*.html',
    ])
    .pipe(ngHtml2Js({
        moduleName: "myApp",
        prefix: "src/directives/tpls/"
    }))
    .pipe(concat("templatesTpls.min.js"))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./tmp/templates'))
});

gulp.task('templatesViews', function () {
  return gulp.src([
      './app/src/templates/**/*.html'
    ])
    .pipe(ngHtml2Js({
        moduleName: "myApp",
        rename:function (templateUrl, templateFile) {
          var pathParts = templateFile.path.split('//');
          var file = pathParts[pathParts.length - 1];
          var folder = pathParts[pathParts.length - 2];
          if ("templates" === folder) {
            return "./src/templates/" + file
          } else {
            return "./src/templates/" + folder + '/' + file
          }
        }
    }))
    .pipe(concat("templatesViews.min.js"))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./tmp/templates'))
});

gulp.task('copyTemplatesToDist', function () {
  return gulp.src([
      './app/src/templates/**/*.html',
    ])
  .pipe(gulp.dest(distFolderUrl + '/src/templates'));
});

gulp.task('copyTplsToDist', function () {
  return gulp.src([
      './app/src/directives/tpls/**/*.html',
    ])
  .pipe(gulp.dest(distFolderUrl + '/src/directives/tpls'));
});

// gulp.task('font', function() {
//   return gulp.src(['./app/public/fonts/**/*'], {base: './app/'})
//   .pipe(gulp.dest(distFolderUrl + ''))
// });

// gulp.task('images', function() {
//   return gulp.src(['./app/public/images/**/*'], {base: './app/'})
//   .pipe(gulp.dest(distFolderUrl + ''))
// });

gulp.task('public', function() {
  return gulp.src(['./app/public/**/*','./app/*.ico'], {base: './app/'})
  .pipe(gulp.dest(distFolderUrl))
});


gulp.task('vendorCss',function () {
  return gulp.src(['./app/bower_components/**/*.css'])
    .pipe(gulp.dest(distFolderUrl + '/vendor'))
})
gulp.task('vendorFont',function () {
  return gulp.src([ './app/bower_components/bootstrap/dist/fonts/**'])
    .pipe(gulp.dest(distFolderUrl + '/vendor/bootstrap/dist/fonts'))
})
gulp.task('vendorJs',function () {
  return gulp.src('./app/bower_components/**/*.js')
    .pipe(gulp.dest(distFolderUrl + '/vendor'))
})
// gulp.task('vendor', ['vendorCss', 'vendorJs', 'vendorFont']);

gulp.task('vendor', function () {
  return gulp.src(['./app/bower_components/**/*'])
    .pipe(gulp.dest(distFolderUrl + '/vendor'))
});


var cssList = [
  './app/src/styles/app.css',
  './app/src/styles/*.css'
];

gulp.task('css', function() {
  return gulp.src(cssList)
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('app.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(distFolderUrl + '/static/css'))
})


var jsList = [
  './app/*.js',
  './app/src/directives/*.js',
  './app/src/controllers/*.js',
  './app/src/services/*.js',
  './app/src/filters/*.js',
  './tmp/templates/*.js',
];

gulp.task('jshint', function () {
  return gulp.src(jsList)
    .pipe(reload({stream: true, once: true}))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
});

// gulp.task('js', ['jshint'], function () {
gulp.task('js', ['templatesTpls','templatesViews'], function () {
  return gulp.src(jsList)
  .pipe(concat('app.min.js'))
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(uglify({
        mangle: false,//类型：Boolean 默认：true 是否修改变量名
        compress: false,//类型：Boolean 默认：true 是否完全压缩
        preserveComments: 'all' //保留注释
    }).on('error', function(e){
    console.log(e);
  }))
  .pipe(gulp.dest(distFolderUrl + '/static/js'))
});


gulp.task('htmlVendor', function () {
  return gulp.src(['app/index-vendor.html'])
    .pipe(useref({ searchPath: ['app'] }))
    // .pipe(rename('index1.html'))
    .pipe(gulpif('*.js', uglify({
            mangle: false,
            compress: false,
            preserveComments: 'all'
        })))
    .pipe(gulpif('*.css', csso()))
    // .pipe(gulpif('*.html', htmlMinify({conditionals: true, loose: false})))
    .pipe(gulp.dest(distFolderUrl));
});

// gulp.task('html', ['copyTemplatesToDist', 'copyTplsToDist'], function () {
gulp.task('html', function () {
  return gulp.src(['app/index-dist.html'])
    .pipe(rename('index.html'))
    // .pipe(assetRev())
    .pipe(gulp.dest(distFolderUrl))
})


//定义css、js源文件路径
var cssSrc = distFolderUrl + '/static/css/*.css',
  jsSrc = distFolderUrl + '/static/js/*.js';

//为css中引入的图片/字体等添加hash编码
gulp.task('assetRev', function(){
  return gulp.src(cssSrc)  //该任务针对的文件
   .pipe(assetRev()) //该任务调用的模块
   .pipe(gulp.dest(distFolderUrl + '/static/css/')); //编译后的路径
});

//CSS生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revCss', function(){
  return gulp.src(cssSrc)
    .pipe(rev())
    // .pipe(gulp.dest(distFolderUrl + '/static/css/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(distFolderUrl + '/rev/css/'));
});


//js生成文件hash编码并生成 rev-manifest.json文件名对照映射
gulp.task('revJs', function(){
  return gulp.src(jsSrc)
    .pipe(rev())
    // .pipe(gulp.dest(distFolderUrl + '/static/js/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest(distFolderUrl + '/rev/js/'));
});


//Html替换css、js文件版本
gulp.task('revHtml', function () {
  return gulp.src([distFolderUrl + '/rev/**/*.json', distFolderUrl + '/index.html'])
    .pipe(revCollector())
    .pipe(gulp.dest(distFolderUrl));
});

//开发构建
gulp.task('addVersion',['build'], function (done) {
  condition = false;
  runSequence(    //需要说明的是，用gulp.run也可以实现以上所有任务的执行，只是gulp.run是最大限度的并行执行这些任务，而在添加版本号时需要串行执行（顺序执行）这些任务，故使用了runSequence.
    // ['assetRev'],
    ['revCss'],
    ['revJs'],
    ['revHtml'],
    done);
});





gulp.task('build', ['public','vendor','html','js','css'], function () {
  return gulp.src(distFolderUrl + '/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('addVersion');
});

  // var files = [
  //     'app/**/*.html',
  //     'app/**/*.css',
  //     'app/**/*.js',
  //     'app/public/**/*',
  //     'app/data/**/*'
  //   ];
  gulp.task('serve',  function () {
    browserSync({
      notify: false, // Don't show any notifications in the browser.
      port: 8081,
      open: false,
      server: {
        baseDir: ['app'],
        routes: {
          // 'bower_components': 'bower_components',//if bower_components' path is up the tree of app
        },
        middleware:
            function (req, res, next) {
                var urlObj = url.parse(req.url, true),
                    method = req.method,
                    paramObj = urlObj.query;
                mockApi(res, urlObj.pathname, paramObj, next);
            }
      }
    });

    // watch for changes
    gulp.watch([
      'app/**/*.html',
      'app/**/*.css',
      'app/**/*.js',
      'app/public/**/*',
      'app/data/**/*'
    ]).on('change', reload);

    gulp.watch('app/src/**/*.less', ['styles', reload]);
    gulp.watch('bower.json', ['fonts', reload]);
  });

  gulp.task('serve-release',  function () {
    browserSync({
      notify: false,
      port: 8081,
      server: {
        baseDir: [distFolderUrl]
      }
    });
  });





