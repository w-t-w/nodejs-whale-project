const path = require('path');

const OUTPUT_DIR = path.resolve(process.cwd(), './list/component/build');

const component_config = {
    devtool: 'cheap-module-source-map',
    mode: 'production',
    target: 'web',
    entry: {
        component_index: './list/component/page/index.js'
    },
    output: {
        publicPath: '',
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: OUTPUT_DIR,
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

module.exports = component_config;