const webpack = require("webpack");

module.exports = {
   entry: './src/main.js',
	
   output: {
      path:'./public/js',
      filename: 'bundle.js',
   },
   module: {
      loaders: [ {
         test: /\.jsx?$/,
         exclude: /node_modules/,
         loader: 'babel',
         query: {
            presets: ['es2015', 'react'],
            plugins:['transform-decorators-legacy']
         }
      }
      ]
   },
plugins: [
        new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
        }),
        new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
        }),
        new webpack.optimize.CommonsChunkPlugin('common',  'common.bundle.js')
    ]
	
}