// ==UserScript==
// @name         CPS Display
// @namespace    AlienC4
// @version      1.0.2
// @description  Adds cubes per second and other ascension info to the div at the top of the screen
// @author       AlienC4
// @match        https://pseudonian.github.io/SynergismOfficial/
// @grant        none
// ==/UserScript==

window.printPrevRun = true;
/*
 * There's an empty div at the top of the screen
 * This puts the cps info into that previously empty space
 */
let calcCTHps = (function () {
    let cps = 0;
    let tps = 0;
    let hps = 0;
    let pps = 0;
    let sec = 0;

    function log() {
        let meta = CalcCorruptionStuff();
        let platonics = meta[7];
        let hypers = meta[6];
        let tess = meta[5];
        let cubes = meta[4];
        let time = player.ascensionCounter;
        if (time > 0 && sec >= time && printPrevRun) {
            console.log(`Cube Rate: ${format(cps, 4, true)}/s, Tess Rate: ${format(tps, 2, true)}/s, Hyper Rate: ${format(hps, 3, true)}/s, Platonic rate: ${format(pps, 4, true)}, Cubes: ${format(cps * sec, 4, true)}, time: ${formatTimeShort(sec)}`);
        }
        cps = cubes / time;
        tps = tess / time;
        hps = hypers / time;
        pps = platonics / time;
        sec = time;
    }

    return log;
})();
window.handleCTHps = setInterval(calcCTHps, 1000);