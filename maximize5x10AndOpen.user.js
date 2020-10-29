// ==UserScript==
// @name         w5x10 Maximizer
// @namespace    AlienC4
// @version      1.3.1
// @description  Attempts to maximize the effect of opening cubes and buying w5x10 with them
// @author       AlienC4
// @coauthor     Dankaati, bgli100, Tree
// @match        https://pseudonian.github.io/SynergismOfficial/
// @grant        none
// ==/UserScript==

window.blessingWeights = [null,
    10, // Accel
    0, // Multi
    6, // Offering
    1, // Rune Exp
    3, // Obtainium
    0, // Ant speed
    10, // Ant sac
    10, // Ant ELO
    18, // Tali levels
    10, // Time Accel
    20]; // Tax Reduction

// w5x10 maximizer for Synergism v2.0.5 by AlienC4
// Usage: Just paste it in the console and call the function
window.maximize5x10AndOpen = (ascTimeMulti = 0, weights = blessingWeights) => {
    // w5x10 Calculator v1.2.4 for Synergism v2.0.5 | Created by bgli100 | Reformatted by Tree#1019 | Added on by AlienC4 to support the maximizer | Bug fixes by Dankaati
    let positiveBonus = 0.5 + (cubeBonusMultiplier[9] - 1) + 0.0004 * player.cubeUpgrades[50]
    let extraPositive = 0.5 + 0.0004 * player.cubeUpgrades[50]
    let totalCubes = player.wowCubes + CalcCorruptionStuff()[4] * ascTimeMulti;
    let is5x10GoodHelper = (percent) => {
        let cubeUpgrades = player.cubeUpgrades;
        let cubeBlessings = player.cubeBlessings;

        // Function to calculate cube multipliers after opening so many more cubes
        let getCM = (o) => {
            let blessings = {
                1: {bonus: cubeBlessings.accelerator + o / 5, powerBonus: cubeUpgrades[45] / 100},
                2: {bonus: cubeBlessings.multiplier + o / 5, powerBonus: cubeUpgrades[35] / 100},
                3: {bonus: cubeBlessings.offering + o / 10, powerBonus: cubeUpgrades[24] / 100},
                4: {bonus: cubeBlessings.runeExp + o / 10, powerBonus: cubeUpgrades[14] / 100},
                5: {bonus: cubeBlessings.obtainium + o / 10, powerBonus: cubeUpgrades[40] / 100},
                6: {bonus: cubeBlessings.antSpeed + o / 10, powerBonus: cubeUpgrades[22] / 40},
                7: {bonus: cubeBlessings.antSacrifice + o / 20, powerBonus: cubeUpgrades[15] / 100},
                8: {bonus: cubeBlessings.antELO + o / 20, powerBonus: cubeUpgrades[25] / 100},
                9: {bonus: cubeBlessings.talismanBonus + o / 20, powerBonus: cubeUpgrades[44] / 100},
                10: {bonus: cubeBlessings.globalSpeed + o / 20, powerBonus: cubeUpgrades[34] / 100}
            }
            let cbm = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 1};
            for (let i = 1; i <= 10; i++) {
                let power = blessingDRPower[i];
                let mult = Math.pow(1000, (1 - power) * (1 + blessings[i].powerBonus));
                if (i === 6) {
                    power = 2.25;
                    mult = 1;
                }
                cbm[i] = 1 + mult * blessingbase[i] * Math.pow(blessings[i].bonus, power * (1 + blessings[i].powerBonus)) * tesseractBonusMultiplier[i];
            }
            cbm[9] += extraPositive - 1;
            return cbm;
        }

        // Calculate w5x10 bonus
        let w5x10 = player.cubeUpgrades[50];
        let meta = calculateSummationNonLinear(w5x10, cubeBaseCost[50], totalCubes * percent, 0.01, 1e5);
        let lvls = meta[0] > w5x10 ? meta[0] - w5x10 : 1;
        let w5x10Bonus = [null, (1 + lvls * 1e-4 / (1 + 1e-4 * w5x10)) ** 2 - 1, lvls * 1e-4 / (1 + 1e-4 * w5x10), lvls * 2e-4 / (1 + 2e-4 * w5x10), 0, lvls * 2e-4 / (1 + 2e-4 * w5x10), 0, 0, 1 / cubeBonusMultiplier[8], lvls * 4e-4 / (positiveBonus), 0, 1 - (1 - 0.666 * w5x10 / 1e5) / (1 - 0.666 * (w5x10 + lvls) / 1e5)];

        // Calculate cube opening bonus
        let resBonus = 1.0611825; // == (1 + 25 / 1000) * (1 + 0.8 * 25 / 1000) * (1 + 0.6 * 25 / 1000)
        let cuBonus = 1.15; // 1 + .05 * 3, the three cube upgrades aren't multiplicative
        let co = meta[1] * resBonus * cuBonus * (CalcECC('ascension', player.challengecompletions[12]) + 1);
        let mul1 = getCM(0);
        let mul2 = getCM(co);
        return [w5x10Bonus, mul2, mul1];
    }
    let maxP = -1;
    let maxTot = 0;
    for (let p = 0; p <= 100; p++) {
        let tot = 0;
        let w5x10Bonus = is5x10GoodHelper(p / 100, false)[0];
        let [mul2, mul1] = is5x10GoodHelper(1 - p / 100, false).splice(1);
        for (let i = 1; i <= 11; i++) {
            let open = mul2[i] / mul1[i];
            let w5x10 = Math.abs(w5x10Bonus[i]) + 1;
            // let multi = i < 11 ? 1 : -1;
            tot += weights[i] * Math.log10(open * w5x10);
        }
        if (tot > maxTot) {
            maxTot = tot;
            maxP = p;
        }
    }

    let w5x10Bonus = is5x10GoodHelper(maxP / 100, false)[0];
    let [mul2, mul1] = is5x10GoodHelper(1 - maxP / 100, false).splice(1);
    let w5x10 = player.cubeUpgrades[50];
    let meta = calculateSummationNonLinear(w5x10, cubeBaseCost[50], totalCubes * (maxP / 100), 0.01, 1e5);
    let lvls = meta[0] > w5x10 ? meta[0] - w5x10 : 1;
    // Print out results
    let printInfo = {
        1: {name: "Accel", enable: true},
        2: {name: "Multi", enable: false},
        3: {name: "Offering", enable: true},
        4: {name: "Rune Exp", enable: false},
        5: {name: "Obtainium", enable: true},
        6: {name: "Ant Speed", enable: false},
        7: {name: "Ant Sac", enable: true},
        8: {name: "Ant ELO", enable: true},
        9: {name: "Tali Lvls", enable: true},
        10: {name: "Time Accel", enable: true},
        11: {name: "Tax Reduce", enable: true}
    }
    console.log(`The maximum bonus from both opening cubes and buying 5x10 is attained by opening ${100 - maxP}% and buying 5x10 with ${maxP}% of your cubes`)
    console.log(`Opening ${format(totalCubes - meta[1])} cubes and buying ${lvls} w5x10 level${lvls === 1 ? "" : "s"}`);
    console.log("Blessing   | Open      | w5x10     | total");
    for (let i = 1; i <= 11; i++) {
        let open = 100 * (mul2[i] / mul1[i] - 1);
        let w5x10 = 100 * w5x10Bonus[i];
        let total = (open / 100 + 1) * (w5x10 / 100 + 1) * 100 - 100
        let openDigits = Math.max(Math.floor(Math.log10(open)), 0)
        let w5x10Digits = i < 11 ? Math.max(Math.floor(Math.log10(w5x10)), 0) : 1;
        if (printInfo[i].enable)
            console.log(`${printInfo[i].name.padEnd(10)} | ${(format(open, 6 - openDigits, true) + "%").padEnd(9)} | ${(format(w5x10, 6 - w5x10Digits, true) + "%").padEnd(9)} | ${(format(total, 6 - openDigits, true) + "%").padEnd(9)}`);
    }
}
