// ==UserScript==
// @name         CPS Display
// @namespace    AlienC4
// @version      1.1.3
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
    if (ascStats.childElementCount === 1)
        ascStats = ascStats.children[0]
    if (document.getElementById("ascPlatonicStats") === null) {
        let ascPlat = document.createElement("span")
        ascPlat.setAttribute("id", "ascPlatonicStats")

        let img = document.createElement("img")
        img.setAttribute("src", "Pictures/Platonic%20Cube.png")
        img.classList.add("corruptionImg")
        ascPlat.appendChild(img)
        let text = document.createElement("span")
        text.setAttribute("id", "ascPlatonic")
        text.style.color = "lightgoldenrodyellow"
        ascPlat.appendChild(text)
        let p = document.createTextNode(" P")
        ascPlat.appendChild(p)
        let unit = document.createElement("span")
        unit.setAttribute("id", "unit4")
        unit.textContent = player.ascStatToggles[4] ? "" : "/s"
        ascPlat.appendChild(unit)

        ascPlat.onclick = () => toggleAscStatPerSecond(4)
        ascStats.insertBefore(ascPlat, ascStats.children[3])
    }
    if (document.getElementById("ascPlatonicStats") && document.getElementById("ascPlatTot") === null && player[Symbol.for("version")] === "2.0.6") {
        let ascPlat = document.getElementById("ascPlatonicStats")
        let ascPlatTot = document.createElement("span")
        ascPlatTot.setAttribute("id", "ascPlatTot")
        ascPlatTot.style.margin = "0 5px"
        ascPlatTot.style.color = "lightgoldenrodyellow"
        ascPlat.appendChild(ascPlatTot)
    }
    if (document.getElementById("ascTimeTakenStats") === null) {
        let ascTime = document.createElement("span")
        ascTime.setAttribute("id", "ascTimeTakenStats")
        ascStats.insertBefore(ascTime, ascStats.children[4])
        ascTime.appendChild(ascStats.children[5])
        ascTime.appendChild(ascStats.children[5])
    }
    if (document.getElementById("ascC10CompletionsStats") === null) {
        let ascC10 = document.createElement("span")
        ascC10.setAttribute("id", "ascC10CompletionsStats")
        ascStats.insertBefore(ascC10, ascStats.children[5])
        ascC10.appendChild(ascStats.children[6])
        ascC10.appendChild(ascStats.children[6])
    }
    if (document.getElementById("ascTimeFactorStats") === null) {
        let ascTime = document.createElement("span")
        ascTime.setAttribute("id", "ascTimeFactorStats")
        ascStats.insertBefore(ascTime, ascStats.children[6])
        ascTime.appendChild(ascStats.children[7])
        ascTime.appendChild(ascStats.children[7])
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
    let flag = false
    updateAscensionStats = function () {
        old()
        let sac = calculateAntSacrificeRewards()
        let fillers = {
            "ascObt": format(sac.obtainium / player.antSacrificeTimerReal) + "/s",
            "ascOff": format(sac.offerings / player.antSacrificeTimerReal) + "/s"
        }
        if (document.getElementById("ascPlatonic").textContent === "") {
            flag = true
        }
        if (flag) {
            let t = player.ascensionCounter
            let [platonic] = CalcCorruptionStuff().splice(7)
            fillers.ascPlatonic = format(platonic * (player.ascStatToggles[4] ? 1 : 1 / t), 5, true)
        }
        for (const key of Object.keys(fillers)) {
            document.getElementById(key).textContent = fillers[key];
        }
    }
    if (document.getElementById("ascHyperStats") === null) {
        let ascStats = document.getElementById("ascensionStats")
        ascStats.style.margin = "0 auto -10px"
        ascStats.style.width = "90%"
        ascStats.children[0].style.width = "100%"
        ascStats.children[0].style.display = "flex"
        ascStats.children[0].style.justifyContent = "center"
        ascStats.querySelectorAll("div>span:nth-child(-n+4)").forEach((elem) => elem.display = "flex")
        ascStats.querySelectorAll("div>span:nth-child(4)").forEach((elem) => elem.style.width = "15.2%")
        ascStats.querySelectorAll("div>span:nth-child(3)").forEach((elem) => elem.style.width = "10%")
        ascStats.querySelectorAll("div>span:nth-child(2)").forEach((elem) => elem.style.width = "11%")
        ascStats.querySelectorAll("div>span:nth-child(1)").forEach((elem) => elem.style.width = "12.5%")
        ascStats.querySelectorAll("div>img").forEach((elem) => elem.style.marginLeft = "4px")
        ascStats.querySelectorAll("img").forEach((elem) => {
            elem.style.position = "relative";
            elem.style.top = "3px";
            elem.style.marginRight = "4px";
        })
        document.getElementById("ascObtStats").style.marginLeft = "4px";
        document.getElementById("ascC10CompletionsStats").style.width = "4%";
    } else if (player[Symbol.for("version")] === "2.0.0") {
        let ascStats = document.getElementById("ascensionStats")
        ascStats.querySelectorAll("div>span:nth-child(4)").forEach((elem) => elem.style.width = "15.2%")
    }
}

setTimeout(initFunc, 5000)
setInterval(() => document.getElementById("ascPlatTot").textContent = `(${player.wowPlatonicCubes} P)`, 10000)