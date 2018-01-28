
'use strict';
var getNote = require('../note');

var Notes = function (state) {
    this.state = state
    Phaser.Group.call(this, state.game);
};

//Documentation for Phaser's (2.6.2) group:: phaser.io/docs/2.6.2/Phaser.Group.html
Notes.prototype = Object.create(Phaser.Group.prototype);

// prefab initialization and construction
Notes.prototype.constructor = Notes;

// Update needed, called automatically by phaser as it's a child of the state.
Notes.prototype.update = function() {
    var self = this;

    for (var i = 0, len = this.children.length; i < len; i++) {

        if (this.children[i].x < this.state.playerNote.x) {
            var playerNote = getNote(this.state.game.myPitch);

            if (playerNote == self.note) {
                this.children[i].makeHappy;  // Should be happy
                this.children[i].body.velocity.x = 0
                this.children[i].body.velocity.y = -100
                // TODO: Score increment
                console.log("success")
            }
            else {
                this.children[i].makeAngry;
                this.children[i].body.velocity.x = 100
                this.children[i].body.velocity.y = -100

                // TODO: Sad increment
                console.log("fail");
            }
        } else {
            console.log(i,"TXPOS:", this.children[i].x, "TGT:", this.state.playerNote.x);
        }

        //this.children[i].update();
    }
};

module.exports = Notes;
