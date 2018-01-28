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

    if (self.fulfilled) {
        return
    } else if (this.x < self.state.playerNote.x) {

        var playerNote = NoteEngine.getNote(this.game.myPitch);

        if (playerNote == self.note) {
            self.makeHappy();
            self.body.velocity.x = 0;
            self.body.velocity.y = -100;
            console.log("success");
            self.state.incrementHappy();
            self.noteText.destroy();

        }
        else {
            console.log("FAIL!", playerNote, "!=", self.note);
            self.makeAngry();
            self.body.velocity.x = 100;
            self.body.velocity.y = -100;
            self.state.incrementAngry();
            self.noteText.destroy();
        }
        self.fulfilled = true;
    }
};

Note.prototype.render = function (){
};

Note.prototype.makeAngry = function () {
    this.tint = '0xff3300';
    this.loadTexture("angry");
};

Note.prototype.makeSad = function () {
    this.tint = '0x0099ff';
    this.loadTexture("sad");
};

Note.prototype.makeHappy = function () {
    this.tint = '0x66ff33';
    this.loadTexture("happy");
};

Note.prototype.scaleSprite = function (sprite, increment){
        sprite.scale.setTo(sprite.scale.x + increment);
        sprite.alpha -= 0.01;
};

module.exports = Note;
