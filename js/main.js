// var $startButton = $(".start-button");
// var $splashScreen = $(".splash-screen");

// $startButton.on("click", function () {
// 	$splashScreen.slideUp(2000, function () {
// 		startGame();
// 	})
// });

// startGame()

var tokenCount = {
    blue: 7,
    red: 7
}

var stockpileCount = {
    blue: 7,
    red: 7
}

// while (true) {
//     gameTurn()
// }
gameTurn()

function gameTurn() {
    players = ["red", "blue"]
    updateStockpileGraphic()

    for (player of players) {
        takeTurn(player)
    }
}

function takeTurn(player) {
    console.log("your turn "+player)
    roller = $(`.${player}-roll`).removeClass("invisible")

    roller.on("click", function()
        {
            result = rollDice()
            possibleMoves = calcMoveOptions(result, player, stockpileCount[player])
            if (possibleMoves == null) {
                console.log("no possible moves!")
                return
            }
            console.log(possibleMoves)
            for (possibleMove of possibleMoves) {
                
                // highlest end if necessary, otherwise result squares ahead
                if (possibleMove > 14) {
                    highlightMove = $(`.${player}-end`).addClass("orange")
                } else {
                    highlightMove = $(`.${player}-${possibleMove}`).addClass("orange")
                }

                if ($(".orange") == []) {
                    console.log("no moves!")
                }

                highlightMove.on("click", function() {

                    // calc origin and destination of the movement
                    destination = Number(this.innerText);
                    origin = destination - result;

                    console.log("origin: "+origin)
                    console.log("destination: "+destination)

                    // we check if anything can leave the board as this requires special treatment
                    if (destination > 14) {
                        highlightEndTokens = $(`.${player}-${origin},.${player}-${origin+1},.${player}-${origin+2},.${player}-${origin+3}`)
                        .filter($(`.${player}-token`))
                        console.log("end tokens length is "+highlightEndTokens.length)
                        
                        // if there are more than 1 options to remove from board we allow player to select which
                        if (highlightEndTokens.length > 1) {
                            highlightEndTokens.addClass("red")
                            highlightEndTokens.on("click", function() {
                                removeCounter(player);
                                console.log(this)
                                $(this).removeClass(`${player}-token`)

                                // cleanup end tokens
                                highlightEndTokens.removeClass("red")
                                highlightEndTokens.off()
                            })
                        // otherwise just remove the only option as normal
                        } else {
                            removeCounter(player);
                            highlightEndTokens.removeClass(`${player}-token`);
                        }
                    // if nothing can leave the board we ignore
                    } else {
                        $(`.${player}-${origin}`).removeClass(`${player}-token`);
                        $(`.${player}-${destination}`).addClass(`${player}-token`);
                    }
                    if (origin == 0) {
                        console.log("removing from stockpile"+ player)
                        removeStockpile(player)
                    }

                    // cleanup
                    $(".orange").off().removeClass("orange");
                })
            }
        }
    )
}

function removeCounter(player) {
    tokenCount[player] --
    if (tokenCount[player] < 1) {
        win(player)
    }
}

function removeStockpile(player) {
    stockpileCount[player] --
    updateStockpileGraphic()
}

function updateStockpileGraphic() {
    console.log("updating graphic")
    $(".red-counter").text("O".repeat(stockpileCount["red"]))
    $(".blue-counter").text("O".repeat(stockpileCount["blue"]))
}

function rollDice() {
    dice = $(".dice")
    succ = 0
    for (die of dice) {
        console.log(die)
        if (Math.floor(Math.random()*4) > 1) {
            $(die).text("SUCCESS")
            succ ++
        } else {
            $(die).text("FAIL")
        }
    }
    return succ
}

function calcMoveOptions(number, player, stockpile) {
    if (number == 0) {
        return null
    }
    currentTokens = $(`.${player}-token`)
    if (stockpile == 0) {
        currentTokensIdx = []
    } else {
        currentTokensIdx = [0]
    }
    for (token of currentTokens) {
        currentTokensIdx.push(Number(token.innerText))
    }
    return currentTokensIdx.map(e => e+number)
}