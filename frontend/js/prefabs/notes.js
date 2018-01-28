'use strict';

var NoteEngine = require('../note');

var Notes = function (state) {
    this.state = state;
    Phaser.Group.call(this, state.game);
};

//Documentation for Phaser's (2.6.2) group:: phaser.io/docs/2.6.2/Phaser.Group.html
Notes.prototype = Object.create(Phaser.Group.prototype);

// prefab initialization and construction
Notes.prototype.constructor = Notes;

// Update needed, called automatically by phaser as it's a child of the state.
Notes.prototype.update = function() {
    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i].update();
    }
};

module.exports = Notes;
