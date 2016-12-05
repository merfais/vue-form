// https://github.com/shelljs/shelljs
require('shelljs/global')
const exec = require('child_process').exec;
env.NODE_ENV = 'development'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.dev.conf')

var spinner = ora({
    text: 'building for production...',
    color: 'green',
    stream: process.stdout
})
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
console.log(assetsPath);
exec('rm -rf ' + assetsPath, function(){});
// rm('-rf', assetsPath)
// mkdir('-p', assetsPath)
// cp('-R', 'static/', assetsPath)

var compiler = webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    timings: true,
    assets: true,
  }) + '\n')
})

// var devMiddleware = require('webpack-dev-middleware')(compiler, {
//  // publicPath: webpackConfig.output.publicPath,
//   stats: {
//     colors: true,
//     chunks: false,
//     timings: true,
//     assets: true,
//   }
// })

// var hotMiddleware = require('webpack-hot-middleware')(compiler)
// // force page reload when html-webpack-plugin template changes
// compiler.plugin('compilation', function (compilation) {
//     console.log('compile start time = ' + new Date());
//   compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//       console.log('after html-webpack-plugin-after-emit');
//     hotMiddleware.publish({ action: 'reload' })
//     cb()
//   })
// })

// devMiddleware.waitUntilValid(function(){
//     console.log('compile end time = ' + new Date());
//      console.log('********************');
// })
