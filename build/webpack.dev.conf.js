var path = require('path')
var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const exec = require('child_process').exec;

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
})

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, extract: true })
  },
  vue: {
    loaders: utils.cssLoaders({
      sourceMap: config.dev.cssSourceMap,
      extract: true
    })
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  watch: true,
  watchOptions: {
    poll: true,
  },
  node: {
    console: true,
    global: true,
    process: true,
    Buffer: true,
    __filename: "mock",
    __dirname: "mock",
    setImmediate: true
  },
  profile: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // generate dist index.html with correct asset hash for caching.
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // extract css into its own file
    new ExtractTextPlugin(utils.assetsPath('css/[name].css')),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // print progress info to the console
    // after all exec shell to do something
    new webpack.ProgressPlugin(function handler(percentage, msg) {
      console.log((percentage * 100).toFixed(2) + '% => ' + msg);
      if(percentage == 1){
        console.log('build ok');

        exec('ls ./', function(){});
        exec('ls ../', function(){});
        exec('pwd', function(){});
        //exec('cp ' + config.build.assetsRoot + path.resolve(__dirname, '../test'), function(){});
      }
    }),
    
    
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
    
  ]
})
