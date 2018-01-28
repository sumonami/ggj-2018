'use strict';

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getRandomNote () {
    return noteStrings[Math.floor(Math.random()*noteStrings.length)];
}

function getNote(frequency) {
    var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
    var note = Math.round( noteNum ) + 69;
    return noteStrings[note%12];
}

module.exports = {
    getNote: getNote,
    getRandomNote: getRandomNote,
    noteStrings: noteStrings
};
