'use strict';

var CONFIG = require('../config');
var NoteEngine = require('../note');

var Note = function(state, playerinfo) {
    var x = playerinfo.initLoc[0];
    var y = playerinfo.initLoc[1];
    var image = playerinfo.image;
    this.state = state;
    this.isPlayer = playerinfo.isPlayer;
    this.fulfilled = false;
    if (this.isPlayer) {
        this.note = NoteEngine.getNote(state.game.myPitch);
    } else {
        this.note = NoteEngine.getRandomNote();
    }

    // instantiate object
    Phaser.Sprite.call(this, state.game, x, y, image);
    this.noteText = this.game.add.text(playerinfo.initLoc[0] - 20, state.game.height-230, this.note, CONFIG.font.bigStyle);

    // constants
    this.x = x;
    this.y = y;
    this.tint = playerinfo.tint;
    this.anchor.set(0.5); //???

    //physics
    state.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;

    this.body.velocity.x = playerinfo.initVel;
    // add to canvas and log
    state.game.add.existing(this);


    //Collision stuff
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.body.mass = 100;
    this.body.bounce.set(1);
    this.body.stopVelocityOnCollide = true;
};

Note.prototype = Object.create(Phaser.Sprite.prototype);

Note.prototype.constructor = Note;

Note.prototype.update = function() {
    var self = this;

    self.noteText.position.x = this.x;

    if ((!self.fulfilled) && (this.x < self.state.playerNote.x)) {

        var playerNote = NoteEngine.getNote(this.game.myPitch);

        if (playerNote == self.note) {
            self.makeHappy();
            self.state.scoreHappy(1);
        }
        else {
            self.makeAngry();
            self.state.scoreAngry(1);
        }

        self.noteText.destroy();
        self.fulfilled = true;
    }
    if ((self.isPlayer) && self.state.gameOver){
        if (self.state.endCondition == "win"){
            this.makeHappy();
        } else {
            this.makeSad();
            this.body.velocity.x = 50;
            this.body.velocity.y = -100;
        }
    }
};

Note.prototype.render = function (){
};

Note.prototype.makeAngry = function () {
    this.tint = '0xff3300';
    this.loadTexture("angry");
    this.body.velocity.x = 100;
    this.body.velocity.y = -100;
};

Note.prototype.makeSad = function () {
    this.tint = '0x0099ff';
    this.loadTexture("sad");
    this.body.velocity.x = 0;
    this.body.velocity.y = 100;
};

Note.prototype.makeHappy = function () {
    this.tint = '0x66ff33';
    this.loadTexture("happy");
    this.body.velocity.x = 0;
    this.body.velocity.y = -100;
};

Note.prototype.scaleSprite = function (sprite, increment){
        sprite.scale.setTo(sprite.scale.x + increment);
        sprite.alpha -= 0.01;
};

module.exports = Note;
