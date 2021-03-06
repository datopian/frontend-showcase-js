// For info about this file refer to webpack and webpack-hot-middleware documentation
// For info on how we're generating bundles with hashed filenames for cache busting: https://medium.com/@okonetchnikov/long-term-caching-of-static-assets-with-webpack-1ecb139adb95#.w99i89nsz
import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import WebpackMd5Hash from 'webpack-md5-hash'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import autoprefixer from 'autoprefixer'
import path from 'path'

require('dotenv').config()
require('babel-polyfill')

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('production')
  , __DEV__: false
}

const SCRIPTS_PATH = 'dist'

export default {
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
    , alias: {
      handsontable: path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.js')
    }
  }
  , node: {
    fs: 'empty'
  }
  , debug: true
  , devtool: 'source-map' // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  , noInfo: true // set to false to see a list of every file being bundled.
  , entry: ['babel-polyfill', path.resolve(__dirname, 'src/index')]
  , target: 'web' // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  , output: {
    path: path.resolve(__dirname, SCRIPTS_PATH)
    , publicPath: '/static/dpr-js/dist'
    , pathInfo: true
    , filename: 'bundle.js'
  }
  , plugins: [
    // Hash the files using MD5 so that their names change when the content changes.
    new WebpackMd5Hash()

    // Optimize the order that items are bundled. This assures the hash is deterministic.
    , new webpack.optimize.OccurenceOrderPlugin()

    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    , new webpack.DefinePlugin(GLOBALS)

    // Generate an external css file with a hash in the filename
    , new ExtractTextPlugin('[name].css')

    // Eliminate duplicate packages when generating bundle
    , new webpack.optimize.DedupePlugin()

    // Minify JS
    , new webpack.optimize.UglifyJsPlugin()
  ]
  , module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel'] }
      , { test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap!postcss?sourceMap') }
      , { test: /\.json$/, loader: 'json' }
    ]
    , noParse: [path.join(__dirname, 'node_modules/handsontable/dist/handsontable.full.js')]
  }
  , postcss: () => [autoprefixer]
}
