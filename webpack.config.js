const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const identity = (i) => i;

module.exports = (env) => {
  console.log('Env is ' + env);

  const isDev = env === 'dev';

  const ifDev = (then) => (isDev ? then : null);
  const ifProd = (then) => (env === 'prod' ? then : null);

  return {
    target: 'web',
    profile: true,
    entry: [ifDev('react-hot-loader/patch'), './appLoader', './components/employees-list'].filter(identity),
    performance: { hints: false },
    context: path.resolve(__dirname, './src'),
    devtool: isDev ? 'cheap-module-source-map' : false,
    resolve: { modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './assets'), 'node_modules'] },
    output: { publicPath: '/', path: path.resolve(__dirname, './dist'), filename: isDev ? 'app.bundle.js' : 'app.bundle.[chunkhash].js', },
    node: {
      //allow Joi package to be bundled on browser since it is originally made for node.js
      crypto: 'empty',
      net: 'empty',
      dns: 'empty',
    },
    plugins: [
      ifProd(new CleanWebpackPlugin(['dist/*.*'], { verbose: true, })),
      ifProd(new webpack.LoaderOptionsPlugin({ minimize: true, debug: false })),
      new webpack.EnvironmentPlugin({ DEBUG: isDev, NODE_ENV: isDev ? 'development' : 'production' }),
      new HtmlWebpackPlugin({ template: 'index.html', inject: true, minify: { collapseWhitespace: true } }),
      ifDev(new webpack.HotModuleReplacementPlugin()),
      ifDev(new webpack.NamedModulesPlugin()),
      new ExtractTextPlugin({ filename: 'app.bundle.[contenthash].css', disable: isDev }),
      ifProd(new BabiliPlugin({}, { comments: false }))
    ].filter(identity),
    devServer: {
      port: 80,
      host: '0.0.0.0',
      hot: true,
      compress: true,
      historyApiFallback: true,
      disableHostCheck: true,
      contentBase: path.resolve(__dirname, './dist'),
      overlay: { warnings: true, errors: true },
    },

    module: {
      rules: [{
        test: /\.js$/,
        include: [path.resolve(__dirname, './src') ],
        use: 'babel-loader'
      }, {
        test: /\.(css|less)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: isDev, minimize: isDev ? false : { discardComments: { removeAll: true } } } },
            { loader: 'less-loader', options: { noIeCompat: true, sourceMap: isDev, paths: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')] } }
          ]
        })
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{ loader: 'url-loader', options: { limit: 4096 } }]
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
      ]
    }
  };
};