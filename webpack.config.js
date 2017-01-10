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
   }
	
}