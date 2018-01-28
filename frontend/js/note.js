'use strict';

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getRandomNote () {
    return noteStrings[Math.floor(Math.random()*noteStrings.length)];
}

function hertzToOffset(hertz) {
    var bottom = 825.00;
    var top = 185.00;
    var line_increment = (bottom - top)/length(noteStrings);
    console.log("line_increment", line_increment);
    var hertz_diff = bottom - hertz;
    return Math.ceil(hertz_diff / line_increment)
}


function getNote(frequency) {
    var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
    var note = Math.round( noteNum ) + 69;
    return noteStrings[note%12];
}

module.exports = {
    getNote: getNote,
    getRandomNote: getRandomNote,
    hertzToOffset: hertzToOffset,
    noteStrings: noteStrings
};
