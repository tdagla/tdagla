const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: {
        tdagla: './src/index.js',
    },
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, './'),
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: "tdagla",
            type: 'umd',
        },
    }
};
