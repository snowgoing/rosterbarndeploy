const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval',

  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      { test: /\.js?$/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      },
      { test: /\.scss?$/,
        loaders: ["style", "css", "sass"]},
      { test: /\.png$/,
        loader: 'file' },
      { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file'},
      { test: /\.woff(\?.*)?$/,
        loader: 'url',
        query: {
        prefix: 'fonts/',
        name: '[path][name].[ext]',
        limit: 10000,
        mimetype: 'application/font-woff'
        }
      },
  {
    test: /\.woff2(\?.*)?$/,
    loader: 'url',
    query: {
      prefix: 'fonts/',
      name: '[path][name].[ext]',
      limit: 10000,
      mimetype: 'application/font-woff2'
    }
  },
  {
    test: /\.ttf(\?.*)?$/,
    loader: 'url',
    query: {
      prefix: 'fonts/',
      name: '[path][name].[ext]',
      limit: 10000,
      mimetype: 'application/octet-stream'
    }
  },
  {
    test: /\.eot(\?.*)?$/,
    loader: 'file',
    query: {
      prefix: 'fonts/',
      name: '[path][name].[ext]'
    }
  },
  {
    test: /\.svg(\?.*)?$/,
    loader: 'url',
    query: {
      prefix: 'fonts/',
      name: '[path][name].[ext]',
      limit: 10000,
      mimetype: 'image/svg+xml'
    }
  },
  {
    test: /\.(png|jpg)$/,
    loader: 'url',
    query: {
      limit: 8192
    }
  },
  {
    test: /\.json$/,
    loader: 'json'
  }
    ]
  }
}
