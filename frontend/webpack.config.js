'use strict';

var path = require('path');
var webpack = require('webpack');

// External module webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var microphonePitchModule = path.join(__dirname, '/node_modules/microphone-pitch/');

var phaser = path.join(phaserModule, 'build/custom/phaser-arcade-physics.js');
var pixi = path.join(phaserModule, 'build/custom/pixi.js');
var micPitch = path.join(microphonePitchModule, 'microphone-pitch.js');

module.exports = {
    entry: {
        'main': './boot.js'
    },
    output: {
        path: '../static/',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                sequences: true,
                properties: false,
                dead_code: true,
                conditionals: true,
                comparisons: true,
                evaluate: true,
                unused: true,
                if_return: true,
                join_vars: true,
                drop_console: false
            },
            output: {
            },
            comments: true,
        })
    ],
    module: {
        loaders: [
            { test: /pixi\.js/, loader: 'expose?PIXI' },
            { test: /phaser-arcade-physics\.js$/, loader: 'expose?Phaser' },
            { test: /microphone-pitch\.js$/, loader: 'expose?MicPitch' }
        ]
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'micPitch': micPitch,
        }
    }
};
