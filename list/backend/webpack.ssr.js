const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, './build');

const ssr_config = {
    devtool: 'cheap-module-source-map',
    target: 'node',
    mode: 'production',
    stats: {
        preset: 'minimal'
    },
    entry: {
        ssr_index: './list/backend/client/page/index.js'
    },
    output: {
        publicPath: '',
        path: OUTPUT_DIR,
        filename: '[name].js',
        chunkFilename: '[name].js',
        library: {
            type: 'umd'
        }
    },
    module: {
        rules: [{
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }]
        }]
    }
};

module.exports = ssr_config;