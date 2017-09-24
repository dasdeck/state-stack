import {Server,config} from 'karma';

let server = new Server({
    basePath: __dirname,

    frameworks: ['jasmine'],

    files: [{pattern: "./*.test.js"}],
    exclude: [],
    preprocessors: {"./*.test.js": ['webpack','sourcemap']},
    webpack:{
        devtool: 'inline-source-map'
    },

    reporters: ['progress'],
    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: process.argv.indexOf('-w') >= 0,

    browsers: ['Chrome'],


    singleRun: process.argv.indexOf('-w') <= 0,
    concurrency: Infinity
});

server.start();