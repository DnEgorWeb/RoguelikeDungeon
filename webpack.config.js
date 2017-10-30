const path = require('path');

module.exports = {
    entry: './src/App.js',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public")
    },
    devServer: {
        contentBase: './public'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx']
    }
};