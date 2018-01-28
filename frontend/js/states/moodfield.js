'use strict';

var _common = require('./_common');
var CONFIG = require('../config');
var Note = require('../prefabs/note');
var Notes = require('../prefabs/notes');
var MoodfieldState = function() {};
var NoteEngine = require('../note');

var timer, timerEvent;


MoodfieldState.prototype.preload = function() {
    _common.setGameScale(this.game);
};


MoodfieldState.prototype.create = function(game) {
    var state = this;

    // Init
    state.gameOver = true;
    state.happyText = this.game.add.text(0, 0, null, CONFIG.font.bigStyle);
    state.angryText = this.game.add.text(state.game.width - 280, 0, null, CONFIG.font.bigStyle);

    //  This will run in Canvas mode, so let's gain a little speed and display
    state.game.renderer.clearBeforeRender = false;
    state.game.renderer.roundPixels = false;

    state.game.physics.startSystem(Phaser.Physics.ARCADE);  // We need arcade physics

    // Background graphics
    this.createBackground();

    // Start game for now
    this.startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.startButton.onDown.add(state.startGame, this);
    this.titleText = this.game.add.text(0, 0, "Press SPACE to start!", CONFIG.font.bigStyle);
};


MoodfieldState.prototype.update = function() {
    var state = this;

    if (state.gameOver) {
        return;
    }

    // Deal with player noise making
    var curNote = NoteEngine.getNote(state.game.myPitch);
    if (curNote) {
        state.noteText.setText(curNote);
    } else {
        state.noteText.setText("");
    }

    state.roadTop.tilePosition.x-= 1;
    state.roadBottom.tilePosition.x -= 2;
    state.notes.update();
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


MoodfieldState.prototype.addTargetNote = function() {
    var state = this;

    if (state.gameOver) {
        return;
    }

    console.log("creating target...");
    var npcNoteInfo = {
        initLoc: [state.game.width+1, state.game.height-150],
        initVel: -200,
        isPlayer: false,
        sprite: 'sad',
        image: 'sad',
        tint: '0x0099ff' // "sad" blue
    };
    var newnote = new Note(state, npcNoteInfo);

    state.notes.add(newnote);

    state.game.notesToAdd--;
    if (state.game.notesToAdd < 1) {
        if (state.game.noteWaitTime <= state.game.minNoteWaitTime){
            console.log("max speed reached!");
            state.game.notesToAdd = 50000;
            state.game.noteWaitTime = state.game.minNoteWaitTime;
            state.game.time.events.repeat(Phaser.Timer.SECOND * state.game.noteWaitTime, state.game.notesToAdd, this.addTargetNote, state);
        } else {
            state.game.notesToAdd = 1;
            state.game.noteWaitTime = (state.game.noteWaitTime * state.game.noteWaitTimeReduceFactor);
            state.game.time.events.repeat(Phaser.Timer.SECOND * state.game.noteWaitTime, state.game.notesToAdd, this.addTargetNote, state);
        }
    }
};


MoodfieldState.prototype.scoreHappy = function(num) {
    var self = this;

    if (!num) {
        self.happyScore = 0;
    } else {
        self.happyScore += num;
    }
    self.happyText.setText("Happy Tones: " + self.happyScore);
    if (self.happyScore > CONFIG.settings.happyMax) {
        self.endGame("win");
    }
};


MoodfieldState.prototype.scoreAngry = function(num) {
    var self = this;

    if (!num) {
        self.angryScore = 0;
    } else {
        self.angryScore += num;
    }
    self.angryText.setText("Angry Tones: " + self.angryScore);
    if (self.angryScore > CONFIG.settings.angryMax) {
        self.endGame("lose");
    }
};


MoodfieldState.prototype.startGame = function() {
    var state = this;

    if (!state.gameOver) {
        return;  // We've already started!
    }

    // Cleanup title screen
    state.titleText.destroy();

    // Reset state where applicable
    state.gameOver = false;
    state.scoreHappy();
    state.scoreAngry();

    // Create player Note
    var playerNoteInfo = {
        initLoc: [50, state.game.height-150],
        initVel: 0,
        isPlayer: true,
        sprite: 'happy',
        image: 'happy',
        tint: '0xffffff' // white
    };
    state.noteText = this.game.add.text(playerNoteInfo.initLoc[0] - 20, state.game.height-230, "Note!", CONFIG.font.bigStyle);
    state.playerNote = new Note(state, playerNoteInfo);

    // NPC Notes
    state.notes = new Notes(state);
    state.game.notesToAdd = 5;
    state.game.noteWaitTime = 3;
    state.game.minNoteWaitTime = 0.5;
    state.game.noteWaitTimeReduceFactor = 0.9;
    state.game.time.events.repeat(Phaser.Timer.SECOND * state.game.noteWaitTime, state.game.notesToAdd, this.addTargetNote, this);
};


MoodfieldState.prototype.endGame = function(endCondition) {
    var state = this;
    state.gameOver = true;
    state.endCondition = endCondition;
    console.log("Game over called");
};

module.exports = MoodfieldState;
