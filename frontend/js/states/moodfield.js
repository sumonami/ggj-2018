'use strict';

var _common = require('./_common');
var Note = require('../prefabs/note');
var MoodfieldState = function() {};

MoodfieldState.prototype.preload = function() {
    _common.setGameScale(this.game);
};

MoodfieldState.prototype.create = function(game) {
    console.log("MOODFIELD create");
    var state = this;

    //  This will run in Canvas mode, so let's gain a little speed and display
    state.game.renderer.clearBeforeRender = false;
    state.game.renderer.roundPixels = false;

    //  We need arcade physics
    state.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.createBackground();
    var playernoteinfo = {
        initLoc: [200, 230],
        sprite: 'happy',
        image: 'happy',
        tint: '0xffffff'
    };
    state.playerNote = new Note(state, playernoteinfo);

};


MoodfieldState.prototype.update = function() {
    var state = this;
    state.roadTop.tilePosition.x--;
    state.roadBottom.tilePosition.x--;
    state.roadBottom.tilePosition.x--;
    state.playerNote.makeHappy();
};

MoodfieldState.prototype.createBackground = function() {
    var state = this;
    state.game.stage.backgroundColor = "#4B7B00";
    state.roadTop = state.game.add.tileSprite(0, state.game.height - 391,
                                              state.game.width, 191,
                                              'roadTop');
    state.roadMiddle = state.game.add.tileSprite(0, state.game.height - 213,
                                                 state.game.width, 132,
                                                 'roadMiddle');
    state.roadBottom = state.game.add.tileSprite(0, state.game.height - 81,
                                                 state.game.width, 81,
                                                 'roadBottom');
};

module.exports = MoodfieldState;
