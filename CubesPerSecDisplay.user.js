// ==UserScript==
// @name         CPS Display
// @namespace    AlienC4
// @version      1.0.1
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
    let sec = 0;

    function log() {
        let meta = CalcCorruptionStuff();
        let hypers = meta[6];
        let tess = meta[5];
        let cubes = meta[4];
        let time = player.ascensionCounter;
        if (sec >= time && printPrevRun) {
            console.log(`Cube Rate: ${format(cps, 4, true)}/s, Tess Rate: ${format(tps, 2, true)}/s, Hyper Rate: ${format(hps, 3, true)}/s, Cubes: ${format(cps * sec, 4, true)}, time: ${formatTimeShort(sec)}`);
        }
        cps = cubes / time;
        tps = tess / time;
        hps = hypers / time;
        sec = time;
        document.getElementsByTagName("div")[2].textContent = `Cube Rate: ${format(cps, 4, true)}/s, Tess Rate: ${format(tps, 2, true)}/s, Hyper Rate: ${format(hps, 3, true)}/s, Cubes: ${format(cubes, 4, true)}, time: ${formatTimeShort(time)}`;
    }

    return log;
})();
window.handleCTHps = setInterval(calcCTHps, 1000);