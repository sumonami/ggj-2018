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
    state.apeshitMode = false;
    this.createBackground();
    state.musTheme = this.add.audio('bgm-title');
    state.bgmTheme = this.add.audio('bgm', 1, true);
    state.apeTheme = this.add.audio('bgm-apeshit');
    state.imgTitle = this.add.sprite(0, 0, 'titleText');
    state.imgTitle.anchor.set(0.5);
    state.imgTitle.x = this.game.width / 2;
    state.imgTitle.y = this.game.height / 2;
    state.gameOver = true;
    state.happyText = this.game.add.text(0, 0, null, CONFIG.font.bigStyle);
    state.angryText = this.game.add.text(state.game.width - 280, 0, null, CONFIG.font.bigStyle);

    //  This will run in Canvas mode, so let's gain a little speed and display
    state.game.renderer.clearBeforeRender = false;
    state.game.renderer.roundPixels = false;

    state.game.physics.startSystem(Phaser.Physics.ARCADE);  // We need arcade physics


    // Start game for now
    this.startButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.startButton.onDown.add(state.startGame, this);
    this.apeButton = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
    this.apeButton.onDown.add(state.goApeshit, this);
    this.titleText = this.game.add.text(0, 0, "Press SPACE to start!", CONFIG.font.bigStyle);

    // Play Theme
    this.musTheme.play();
};


MoodfieldState.prototype.update = function() {
    var state = this;

    // state.game.time.events.repeat(Phaser.Timer.SECOND * 0.5, function() { state.clouds.tilePosition.x += 10; });
    state.clouds.tilePosition.x += 1;

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
    state.game.stage.backgroundColor = "#f7d78a";
    state.clouds = this.add.tileSprite(0, 0, state.game.width, 400, 'clouds');
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
    if (self.happyScore > self.maxHappyScore) {
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
    if (self.angryScore > self.maxAngryScore) {
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
    state.imgTitle.visible = false;
    state.musTheme.stop();
    state.bgmTheme.play();

    // Reset state where applicable
    state.gameOver = false;
    state.scoreHappy();
    state.maxHappyScore = CONFIG.settings.happyMax;
    state.scoreAngry();
    state.maxAngryScore = CONFIG.settings.angryMax;

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
    state.game.notesToAdd = 1;
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


MoodfieldState.prototype.goApeshit = function() {
    var state = this;

    if (state.apeshitMode) {
        state.apeTheme.stop();
        state.bgmTheme.play();
        state.time.events.remove(state.apeEvent);
        state.game.stage.backgroundColor = "#f7d78a";
        state.maxHappyScore = CONFIG.settings.happyMax;
        state.maxAngryScore = CONFIG.settings.angryMax;

        state.game.minNoteWaitTime = 0.5;
        state.game.noteWaitTime = 2;
        state.game.noteWaitTimeReduceFactor = 0.9;

        state.apeshitMode = false;
    } else {

        state.apeshitMode = true;

        state.game.minNoteWaitTime = 0.1;
        state.game.noteWaitTime = 0.7;
        state.game.noteWaitTimeReduceFactor = 0.8;

        // Unlimited score
        state.maxHappyScore = 9999;
        state.maxAngryScore = 9999;

        // Fuck sky up
        state.apeEvent = state.time.events.repeat(Phaser.Timer.SECOND * 0.1, 1000, function() {
            state.game.stage.backgroundColor = Phaser.Color.getRandomColor(50, 255, 255);
        });

        // Play running in the 90s
        state.bgmTheme.stop();
        state.apeTheme.play();
    }
};


module.exports = MoodfieldState;
