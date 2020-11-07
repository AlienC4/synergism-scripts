// ==UserScript==
// @name         CPS Display
// @namespace    AlienC4
// @version      1.2.0
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
window.handleCTHps = setInterval(calcCTHps, 10000);

toggleAscStatPerSecond = function (id) {
    let unit = document.getElementById(`unit${id}`)
    if (player.ascStatToggles[id]) {
        player.ascStatToggles[id] = false;
        if (unit)
            unit.textContent = "/s";
    } else {
        player.ascStatToggles[id] = true;
        if (unit)
            unit.textContent = "";
    }
}
let initFunc = function () {
    if (player.ascStatToggles[4] === undefined)
        player.ascStatToggles[4] = false
    let ascStats = document.getElementById("ascensionStats")
    if (document.getElementById("ascPlatTot") === null && player[Symbol.for("version")] === "2.0.6") {
        let ascPlat = document.getElementById("ascPlatonicStats")
        let ascPlatTot = document.createElement("span")
        ascPlatTot.setAttribute("id", "ascPlatTot")
        ascPlatTot.style.margin = "0 5px"
        ascPlatTot.style.color = "lightgoldenrodyellow"
        ascPlat.appendChild(ascPlatTot)
    }
    if (document.getElementById("ascObtStats") === null) {
        let ascObt = document.createElement("span")
        ascObt.setAttribute("id", "ascObtStats")
        let img = document.createElement("img")
        img.setAttribute("src", "Pictures/Obtainium.png")
        img.classList.add("corruptionImg")
        ascObt.appendChild(img)
        let text = document.createElement("span")
        text.setAttribute("id", "ascObt")
        text.style.color = "pink"
        ascObt.appendChild(text)
        ascStats.appendChild(ascObt)
    }
    if (document.getElementById("ascOffStats") === null) {
        let ascOff = document.createElement("span")
        ascOff.setAttribute("id", "ascOffStats")
        let img = document.createElement("img")
        img.setAttribute("src", "Pictures/Offering.png")
        img.classList.add("corruptionImg")
        ascOff.appendChild(img)
        let text = document.createElement("span")
        text.setAttribute("id", "ascOff")
        text.style.color = "gold"
        ascOff.appendChild(text)
        ascStats.appendChild(ascOff)
    }

    let old = updateAscensionStats
    updateAscensionStats = function () {
        old()
        let sac = calculateAntSacrificeRewards()
        let fillers = {
            "ascObt": format(sac.obtainium / player.antSacrificeTimerReal) + "/s",
            "ascOff": format(sac.offerings / player.antSacrificeTimerReal) + "/s"
        }
        for (const key of Object.keys(fillers)) {
            document.getElementById(key).textContent = fillers[key];
        }
    }
    if (player[Symbol.for("version")] === "2.0.6") {
        let ascStats = document.getElementById("ascensionStats")
        ascStats.querySelectorAll("div>span:nth-child(4)").forEach((elem) => elem.style.width = "15.9%")
    }
}

setTimeout(initFunc, 5000)
if (player[Symbol.for("version")] === "2.0.6") {
    setInterval(() => document.getElementById("ascPlatTot").textContent = `(${player.wowPlatonicCubes} P)`, 10000)
}
