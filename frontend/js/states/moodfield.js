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
    console.log("MOODFIELD create");
    var state = this;

    state.happyScore = 0;
    state.angryScore = 0;

    //  This will run in Canvas mode, so let's gain a little speed and display
    state.game.renderer.clearBeforeRender = false;
    state.game.renderer.roundPixels = false;

    //  We need arcade physics
    state.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.createBackground();
    var playernoteinfo = {
        initLoc: [50, state.game.height-150],
        initVel: 0,
        isPlayer: true,
        sprite: 'happy',
        image: 'happy',
        tint: '0xffffff' // white
    };

    state.happyText = this.game.add.text(0, 0, state.happyScore, CONFIG.font.bigStyle);
    state.angryText = this.game.add.text(state.game.width - 40, 0, state.angryScore, CONFIG.font.bigStyle);
    // state.noteText = this.game.add.text(70, state.game.height - 160, "Note!", CONFIG.font.bigStyle);
    state.noteText = this.game.add.text(playernoteinfo.initLoc[0] - 20, state.game.height-230, "Note!", CONFIG.font.bigStyle);

    state.notes = new Notes(state);
    state.game.notesToAdd = 5;
    state.game.noteWaitTime = 3;
    state.game.minNoteWaitTime = 0.5;
    state.game.noteWaitTimeReduceFactor = 0.5;
    state.game.time.events.repeat(Phaser.Timer.SECOND * state.game.noteWaitTime, state.game.notesToAdd, this.addTargetNote, this);
    // state.game.time.events.repeat(Phaser.Timer.SECOND * 3, 10000, this.addTargetNote, this);
    state.playerNote = new Note(state, playernoteinfo);

};


MoodfieldState.prototype.addTargetNote = function() {
    var state = this;
    console.log("creating target...");
    var playernoteinfo = {
        initLoc: [state.game.width+1, state.game.height-150],
        initVel: -200,
        isPlayer: false,
        sprite: 'sad',
        image: 'sad',
        tint: '0x0099ff' // "sad" blue
    };
    var newnote = new Note(state, playernoteinfo);

    state.notes.add(newnote);

    //state.noteText = this.game.add.text(playernoteinfo.initLoc[0] - 20, playernoteinfo.initLoc[1]-80, "Note!", CONFIG.font.bigStyle);

    state.game.notesToAdd--;
    if (state.game.notesToAdd < 1) {
        if (state.game.noteWaitTime <= state.game.minNoteWaitTime){
            console.log("GAME OVAH!!");
        } else {
            state.game.notesToAdd = 5;
            state.game.noteWaitTime = (state.game.noteWaitTime * state.game.noteWaitTimeReduceFactor);
            state.game.time.events.repeat(Phaser.Timer.SECOND * state.game.noteWaitTime, state.game.notesToAdd, this.addTargetNote, state);
        }
    }
};


MoodfieldState.prototype.update = function() {
    var state = this;

    // Deal with player noise making
    var curNote = NoteEngine.getNote(state.game.myPitch);
    if (curNote) {
        state.noteText.setText(curNote);
    } else {
        state.noteText.setText("");
    }

    state.roadTop.tilePosition.x-= 1;
    state.roadBottom.tilePosition.x -= 2;
    state.playerNote.makeHappy();
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


MoodfieldState.prototype.incrementHappy = function() {
    var self = this;
    self.happyScore++;
    self.happyText.setText(self.happyScore);
    if (self.happyScore > CONFIG.settings.happyMax) {
        self.state.start('End');
    }
};


MoodfieldState.prototype.incrementAngry = function() {
    var self = this;
    self.angryScore++;
    self.angryText.setText(self.angryScore);
    if (self.angryScore > CONFIG.settings.angryMax) {
        self.state.start('End');
    }
};


module.exports = MoodfieldState;
