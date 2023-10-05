const path = require('path');

const OUTPUT_DIR = path.resolve(process.cwd(), './list/backend/client/source/static');

const config = {
    devtool: 'cheap-module-source-map',
    target: 'web',
    mode: 'production',
    entry: {
        web_index: './list/frontend/page/index.js'
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
    stats: {
        preset: 'minimal'
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

module.exports = config;