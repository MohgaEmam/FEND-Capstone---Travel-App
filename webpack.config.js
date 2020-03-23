const path = require("path");
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
//const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.min.js',
        libraryTarget: 'var',
        library: 'Client',
        publicPath: 'http://localhost:2000/'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.html$/, 
                use: [{
                    loader: "html-loader",
                    options: {
                      attrs: [':src']
                    }
                  }] 
            },
            {
                test: /\.scss$/,
                include: [path.resolve(__dirname, 'src', 'client/styles')],
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader"
                }]
            },
            {
              test: /\.(png|jpg|gif|svg|mp4|mov|mp3|ogg|avi|)$/,
              use: [{
                  loader: 'file-loader',
                  options: {
                    name: '[path][name].[ext]',
                    outputPath: ''
                  }
              }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html"
         })
        //,
        // new WorkboxPlugin.GenerateSW({
        //     exclude: [/\.(?:png|jpg|jpeg|svg)$/]
        // })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "./dist/assets/media"),
        compress: true,
        port: 2000,
        stats: 'errors-only',
        open: true
    }
}
