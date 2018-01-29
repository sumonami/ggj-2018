'use strict';

var CONFIG = require('./config');

/**
 * assets.js
 * List of required project assets and some simple logic
 * for preloading them in Phaser.
 * Used during the Startup state to preload and report on all
 * required assets - we do this upfront to prevent pauses/delays
 * during the game.
**/

// Object list of assets to preload
var assets = {

    // images are standard image files.
    // Format is [key, path]
    images: [
        ['clouds', 'images/clouds.png'],
        ['roadBottom', 'images/road_bottom.png'],
        ['roadMiddle', 'images/road_middle.png'],
        ['roadTop', 'images/road_top.png'],
        ['titleText', 'images/title_text.png'],
        ['toneAngry', 'images/tone_angry.png'],
        ['toneHappy', 'images/tone_happy.png'],
        ['toneSad', 'images/tone_sad.png']
    ],
    spritesheets: [
    ],
    // Audio files to load
    sounds: [
        ['bgmTitle', ['audio/bgm-title.mp3',
                      'audio/bgm-title.opus']
        ],
        ['bgmMoodfield', ['audio/bgm-moodfield.mp3',
                          'audio/bgm-moodfield.opus']
        ],
        ['bgmApeshit', ['audio/bgm-apeshit.mp3',
                        'audio/bgm-apeshit.opus']
        ]
    ]
};

/**
 * Calls Phaser's load functions on the assets list and fires a callback
 * when each one completes.
 * @param game - reference to Phaser.Game instance
 * @param fileLoadedCallback - function to fire when *each* file loads
**/
function preloadAssets(game, fileLoadedCallback) {
    game.load.baseURL = CONFIG.assetsPath;

    game.load.onFileComplete.add(fileLoadedCallback, this);

    console.log('Preloading images...');
    assets.images.forEach(function(item) {
        game.load.image(item[0], item[1]);
    });

    console.log('Preloading spritesheets...');
    assets.spritesheets.forEach(function(item) {
        game.load.spritesheet(item[0], item[1], item[2], item[3]);
    });

    console.log('Preloading sounds...');
    assets.sounds.forEach(function(item) {
        game.load.audio(item[0], item[1]);
    });

    game.load.start();
}

module.exports = {
    assets: assets,
    preload: preloadAssets
};
