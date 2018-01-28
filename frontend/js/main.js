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
    'Moodfield': require('./states/moodfield')
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

    game.myPitch = -1;
    game.updateMyPitch = function(pitch){
        game.myPitch = pitch;
    };
    //set global mpitch event loop
    MicPitch.start(function(error) {
      console.log("start:", error);
    });
    MicPitch.onPitchChange(game.updateMyPitch);

    for(var k in States) {
        game.state.add(k, States[k]);
    }

    game.state.start('Startup');
}

module.exports = Main;
