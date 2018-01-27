'use strict';

var _common = require('./_common');

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
};

MoodfieldState.prototype.update = function() {
    var state = this;
    state.roadway.tilePosition.x--;
};

MoodfieldState.prototype.createBackground = function() {
    var state = this;
    state.game.stage.backgroundColor = "#4B7B00";
    state.roadway = state.game.add.tileSprite(0, state.game.height - 600,
                                            state.game.width, state.game.height,
                                            'roadway2');
};

module.exports = MoodfieldState;
