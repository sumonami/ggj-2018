'use strict';

var CONFIG = require('../config');
var NoteEngine = require('../note');

var Note = function(state, playerinfo) {
    var x = playerinfo.initLoc[0];
    var y = playerinfo.initLoc[1];
    var image = playerinfo.image;
    this.state = state;
    this.fulfilled = false;
    this.note = "A";
    // instantiate object
    Phaser.Sprite.call(this, state.game, x, y, image);
    // constants
    this.x = x;
    this.y = y;
    this.tint = playerinfo.tint;
    this.anchor.set(0.5); //???

    //physics
    state.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;

    this.body.velocity.x = playerinfo.initVel;
    // this.body.maxVelocity.set(800);
    // this.repel_max_range=300;
    // this.repel_initial_vel=350;

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
    console.log("update entered, self.x", self.x, "player.x", this.state.playerNote.x);
    if (self.fulfilled) {
        console.log("fufilled! skipping");
    } else if (self.isPlayer){
        console.log("isPlayer! skipping");
    } else if (this.x < self.state.playerNote.x) {
        var playerNote = NoteEngine.getNote(this.game.myPitch);
        console.log("player note is", playerNote);
        console.log("note note is", self.note);

        if (playerNote == self.note) {
            self.makeHappy();
            self.body.velocity.x = 0;
            self.body.velocity.y = -100;
            console.log("success");
            self.state.incrementHappy();
        }
        else {
            self.makeAngry();
            self.body.velocity.x = 100;
            self.body.velocity.y = -100;

            console.log("fail");
            self.state.incrementAngry();
        }
        self.fulfilled = true;
    } else {
        console.log("fuck all happened");
    }
    console.log("update being left, self.x", self.x, "player.x", this.state.playerNote.x);
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
