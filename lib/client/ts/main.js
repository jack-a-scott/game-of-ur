"use strict";
// var $startButton = $(".start-button");
// var $splashScreen = $(".splash-screen");
Object.defineProperty(exports, "__esModule", { value: true });
// $startButton.on("click", function () {
// 	$splashScreen.slideUp(2000, function () {
// 		startGame();
// 	})
// });
// startGame()
const colyseus_js_1 = require("colyseus.js");
const endpoint = "ws://localhost:8080";
let client = new colyseus_js_1.Client(endpoint);
try {
    const room = await client.joinOrCreate("room1");
    console.log("joined succesfully", room);
}
catch (e) {
    console.error("join error", e);
}
var tokenCount = {
    blue: 7,
    red: 7
};
var stockpileCount = {
    blue: 7,
    red: 7
};
let turnFlag = false;
function gameTurn() {
    let players = ["red", "blue"];
    updateStockpileGraphic();
    if (turnFlag) {
        takeTurn("red");
    }
    else {
        takeTurn("blue");
    }
    turnFlag = !turnFlag;
}
gameTurn();
function takeTurn(player) {
    console.log("your turn " + player);
    let roller = $(`.${player}-roll`).removeClass("invisible");
    roller.on("click", function () {
        let result = rollDice();
        let possibleMoves = calcMoveOptions(result, player, stockpileCount[player]);
        if (possibleMoves != null) {
            console.log(possibleMoves);
            for (let possibleMove of possibleMoves) {
                let highlightMove;
                // highlest end if necessary, otherwise result squares ahead
                if (possibleMove > 14) {
                    highlightMove = $(`.${player}-end`).addClass("orange");
                }
                else {
                    highlightMove = $(`.${player}-${possibleMove}`).addClass("orange");
                }
                if ($(".orange") == []) {
                    console.log("no moves!");
                }
                let cb = highlightMove.on("click", function () {
                    // calc origin and destination of the movement
                    let destination = Number(this.innerText);
                    let origin = destination - result;
                    console.log("origin: " + origin);
                    console.log("destination: " + destination);
                    // we check if anything can leave the board as this requires special treatment
                    if (destination > 14) {
                        let highlightEndTokens = $(`.${player}-${origin},.${player}-${origin + 1},.${player}-${origin + 2},.${player}-${origin + 3}`)
                            .filter($(`.${player}-token`));
                        console.log("end tokens length is " + highlightEndTokens.length);
                        // if there are more than 1 options to remove from board we allow player to select which
                        if (highlightEndTokens.length > 1) {
                            highlightEndTokens.addClass("red");
                            highlightEndTokens.on("click", function () {
                                removeCounter(player);
                                console.log(this);
                                $(this).removeClass(`${player}-token`);
                                // cleanup end tokens
                                highlightEndTokens.removeClass("red");
                                highlightEndTokens.off();
                            });
                            // otherwise just remove the only option as normal
                        }
                        else {
                            removeCounter(player);
                            highlightEndTokens.removeClass(`${player}-token`);
                        }
                        // if nothing can leave the board we ignore
                    }
                    else {
                        $(`.${player}-${origin}`).removeClass(`${player}-token`);
                        $(`.${player}-${destination}`).addClass(`${player}-token`);
                    }
                    if (origin == 0) {
                        console.log("removing from stockpile" + player);
                        removeStockpile(player);
                    }
                    // cleanup
                    $(".orange").off().removeClass("orange");
                    gameTurn();
                });
            }
        }
        else {
            console.log("no possible moves!");
            gameTurn();
        }
        roller.off();
        roller.addClass("invisible");
    });
}
function removeCounter(player) {
    tokenCount[player]--;
    if (tokenCount[player] < 1) {
        // win(player)
        let win = true; // no
    }
}
function removeStockpile(player) {
    stockpileCount[player]--;
    updateStockpileGraphic();
}
function updateStockpileGraphic() {
    console.log("updating graphic");
    $(".red-counter").text("O".repeat(stockpileCount["red"]));
    $(".blue-counter").text("O".repeat(stockpileCount["blue"]));
}
function rollDice() {
    let dice = $(".dice");
    let succ = 0;
    for (let die of dice) {
        console.log(die);
        if (Math.floor(Math.random() * 4) > 1) {
            $(die).text("SUCCESS");
            succ++;
        }
        else {
            $(die).text("FAIL");
        }
    }
    return succ;
}
function calcMoveOptions(number, player, stockpile) {
    if (number == 0) {
        return null;
    }
    let currentTokens = $(`.${player}-token`);
    let currentTokensIdx;
    if (stockpile == 0) {
        currentTokensIdx = [];
    }
    else {
        currentTokensIdx = [0];
    }
    for (let token of currentTokens) {
        currentTokensIdx.push(Number(token.innerText));
    }
    return currentTokensIdx.map(e => e + number);
}
