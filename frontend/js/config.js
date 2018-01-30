/**
 * config.js
 * Configuration object that gets passed around the app
 * for convenience.
**/

var CONFIG = {

    stateAfterStartup: 'Moodfield',

    // Pixel size of the Phaser canvas.
    // (Canvas itself is scaled to viewport)
    gameSize: {
        width: 800,
        height: 600
    },

    assetsPath: "assets/",

    // Font style definitions
    font: {
        // Generic/default text
        baseStyle: {
            font: '24px VT323',
            fill: '#caa',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        },
        bigStyle: {
            font: '48px VT323',
            fill: '#caa',
            stroke: '#000',
            strokeThickness: 1,
            boundsAlignH: "center",
            boundsAlignV: "bottom"
        },
        controlStyle: {
            font: '48px VT323',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 1,
            boundsAlignH: "center",
            boundsAlignV: "bottom"
        },

        smallStyle: {
            font: '18px VT323',
            fill: '#c8a',
            stroke: '#000',
            strokeThickness: 1,
            align: 'center'
        }
    },

    // Game settings
    settings: {
        happyMax: 1000,
        angryMax: 3
    }

};

module.exports = CONFIG;
