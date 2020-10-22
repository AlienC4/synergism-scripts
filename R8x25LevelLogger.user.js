// ==UserScript==
// @name         R8x25 Rate Logger
// @namespace    AlienC4
// @version      1.0.1
// @description  New and improved level logger for 8x25, now takes the cost increase into account
// @author       AlienC4
// @match        https://pseudonian.github.io/SynergismOfficial/
// @grant        none
// ==/UserScript==

let levelLog = (function () {
    let levels = player.researches[200];
    let prev_obt = 0

    function log() {
        let sec = player.history.ants[player.historyCountMax - 1].seconds / calculateTimeAcceleration();
        let obt = player.history.ants[player.historyCountMax - 1].obtainium
        let meta = calculateSummationNonLinear(levels, researchBaseCosts[200], obt + prev_obt, 0.01, 1e5)
        if (player.researches[200] !== levels) {
            console.log(`r8x25 levels: ${player.researches[200]}, rate: ${((meta[0] - levels) / sec).toFixed(4)} levels/s`)
            levels = player.researches[200];
            prev_obt = player.researchPoints
        }
    }

    return log;
})();
window.levelLogger = setInterval(levelLog, 1000);