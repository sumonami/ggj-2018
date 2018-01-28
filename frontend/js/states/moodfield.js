'use strict';

var _common = require('./_common');
var Note = require('../prefabs/note');
var Notes = require('../prefabs/notes');
var MoodfieldState = function() {};
var NoteEngine = require('../note');

var timer, timerEvent;

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
        initLoc: [50, state.game.height-150],
        initVel: 0,
        sprite: 'happy',
        image: 'happy',
        tint: '0xffffff' // white
    };

    state.notes = new Notes(state);
    state.game.time.events.repeat(Phaser.Timer.SECOND * 3, 1, this.addTargetNote, this);
    console.log("WIDTH", state.game.width)
    console.log("HEIGHT", state.game.height)
    state.playerNote = new Note(state, playernoteinfo);
    console.log("XPOS", state.playerNote.x)
    console.log("YPOS", state.playerNote.y)

};


MoodfieldState.prototype.addTargetNote = function() {
    var state = this;
    console.log("creating target...");
    var playernoteinfo = {
        initLoc: [state.game.width, state.game.height-200],
        initVel: -200,
        sprite: 'sad',
        image: 'sad',
        tint: '0x0099ff' // "sad" blue
    };
    state.notes.add(new Note(state, playernoteinfo));

    // Randomly log note
    state.time.events.repeat(Phaser.Timer.SECOND * 2, 10, this.logNote, this);
};


MoodfieldState.prototype.update = function() {
    var state = this;
    state.roadTop.tilePosition.x-= 1;
    state.roadBottom.tilePosition.x -= 2;
    state.playerNote.makeHappy();
    state.notes.update()
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

MoodfieldState.prototype.logNote = function() {
    var state = this;
    console.log(NoteEngine.getNote(state.game.myPitch));
};

module.exports = MoodfieldState;
