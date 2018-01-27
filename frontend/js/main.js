'use strict';

var PIXI = require('pixi');
var Phaser = require('phaser');
var MicPitch = require('micPitch');

/**
 * main.js
**/

var CONFIG = require('./config');

var States = {
    'Startup': require('./states/startup'),
    'PlayField': require('./states/playfield'),
    'Moodfield': require('./states/moodfield'),
    'TitleState': require('./states/title'),
    'EndState': require('./states/end')
};
var CUR_PITCH = -1;

function setPitch(pitch) {
    CUR_PITCH = pitch;
};

/**
 * Main app. Little more than a bootstrap - the
 * game logic resides in the various states.
**/
function Main() {
    // Create a new game
    var game = new Phaser.Game(
        CONFIG.gameSize.width,
        CONFIG.gameSize.height,
        Phaser.AUTO
    );

    //set global mpitch event loop
    MicPitch.start(function(error) {
      console.log("start:", error)
    });
    MicPitch.onPitchChange(setPitch);

    for(var k in States) {
        game.state.add(k, States[k]);
    }

    game.state.start('Startup');
}

module.exports = Main;
