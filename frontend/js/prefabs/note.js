'use strict';

var CONFIG = require('../config');

var Note = function(state, playerinfo) {
    var x = playerinfo.initLoc[0];
    var y = playerinfo.initLoc[1];
    var image = playerinfo.image;
    this.state = state;

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
    this.body.drag.set(100);
    this.body.maxVelocity.set(800);
    this.repel_max_range=300;
    this.repel_initial_vel=350;

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
};


Note.prototype.render = function (){
}

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
