/*jshint esversion: 6 */
import nodeExternals from 'webpack-node-externals';

const rules = [{
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
        presets: ['env']
    }
}];

const browser = {
    entry: {
        'state-stack': './src/browser.js'
    },
    output: {
        filename: './dist/state-stack.browser.js',
        libraryTarget: 'var'
    },
    devtool: 'source-map',
    module: {
        rules: rules
    }
};

module.exports = [browser];