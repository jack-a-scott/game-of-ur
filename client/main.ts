// var $startButton = $(".start-button");
// var $splashScreen = $(".splash-screen");

// $startButton.on("click", function () {
// 	$splashScreen.slideUp(2000, function () {
// 		startGame();
// 	})
// });

// startGame()
import { Room, Client } from "colyseus.js";

import { State } from "../server/rooms/State";

const endpoint = "ws://localhost:2543"
let client = new Client(endpoint)
console.log(client)
let player

function main() {
    var room = client.joinOrCreate("ur").then(room => {
        room.onMessage("beginGame", (message) => {
            console.log(message)
            beginGame(room)
        });
        room.onMessage("allowedMoves", (allowedMoves) => {
            console.log(allowedMoves);
            // update UI with allowed moves to be clicked
            moveHighlighter(allowedMoves, room)

        });
        room.onStateChange(function(state: State) {
            if (state.gameInProgress === true) {
                console.log(state)
                updateUI(state, room)                
            } else {
                console.log("state changed but game has not yet begun so not changing anything")
            }

        })     
    });
    console.log("joined succesfully", room);

}
main()

function beginGame(room: Room) {
    console.log("game has begun")
    console.log("my session id", room.sessionId)
    console.log("who's turn?", room.state.currentTurn)
    if (room.state.currentTurn === room.sessionId) {
        let roller = $(`.roll`).removeClass("invisible")
        roller.on("click", function()
            {
                room.send("action", "roll");
                roller.addClass("invisible")
                roller.off()
            }
        )
    }
}

function updateUI(state : State, room: Room) {
    console.log("updating UI")
    console.log(state)
    updateDiceUI(state.diceRolls)
    updateCounterUI(state.counterPositions, room)
}

function updateDiceUI(results: number[]) {
    console.log("updating dice UI element")
    console.log(results)
    let dice = $(".dice")
    console.log(results)
    results.forEach((result, index) => {
        $(dice[index]).text(result)
    })
}

function updateCounterUI(counterPositions, room: Room) {
    // for eahc player 
    console.log("THESE ARE THE COUNTER POSITIONS", counterPositions)
    counterPositions.forEach((positions: number[], sessionId: string) => {
        let player = sessionId === room.sessionId ? "you" : "enemy" 
        // iterate each possible square
        Array(14).forEach((idx) => {
            // if the list of positons includes the current one
            if (positions.includes(idx)) {
                // then add class to the square
                $(`.${player}-${idx}`).addClass("${player}-token")
            } else {
                $(`.${player}-${idx}`).removeClass("${player}-token")
            }
            $(`.${player}-${idx}`).removeClass('orange')
        });
    })
}

function moveHighlighter(allowedMoves: number[], room: Room) {
    allowedMoves.forEach((move) => {
        let square = $(`.you-${move}`)
        square.addClass('orange')
        square.on("click", function(square) {
            room.send("chosenMove", square)
        })
    })
}

// function takeTurn(player: string) {
//     console.log("your turn "+ player)

//     roller.on("click", function()
//         {
//             let result = rollDice()
//             let possibleMoves = calcMoveOptions(result, player, stockpileCount[player])
//             if (possibleMoves != null) {
//                 console.log(possibleMoves)
//                 for (let possibleMove of possibleMoves) {
                    
//                     let highlightMove;
//                     // highlest end if necessary, otherwise result squares ahead
//                     if (possibleMove > 14) {
//                         highlightMove = $(`.${player}-end`).addClass("orange")
//                     } else {
//                         highlightMove = $(`.${player}-${possibleMove}`).addClass("orange")
//                     }

//                     if ($(".orange") == []) {
//                         console.log("no moves!")
//                     }

//                     let cb = highlightMove.on("click", function() {

//                         // calc origin and destination of the movement
//                         let destination = Number(this.innerText);
//                         let origin = destination - result;

//                         console.log("origin: "+origin)
//                         console.log("destination: "+destination)

//                         // we check if anything can leave the board as this requires special treatment
//                         if (destination > 14) {
//                             let highlightEndTokens = $(`.${player}-${origin},.${player}-${origin+1},.${player}-${origin+2},.${player}-${origin+3}`)
//                             .filter($(`.${player}-token`))
//                             console.log("end tokens length is "+highlightEndTokens.length)
                            
//                             // if there are more than 1 options to remove from board we allow player to select which
//                             if (highlightEndTokens.length > 1) {
//                                 highlightEndTokens.addClass("red")
//                                 highlightEndTokens.on("click", function() {
//                                     removeCounter(player);
//                                     console.log(this)
//                                     $(this).removeClass(`${player}-token`)

//                                     // cleanup end tokens
//                                     highlightEndTokens.removeClass("red")
//                                     highlightEndTokens.off()
//                                 })
//                             // otherwise just remove the only option as normal
//                             } else {
//                                 removeCounter(player);
//                                 highlightEndTokens.removeClass(`${player}-token`);
//                             }
//                         // if nothing can leave the board we ignore
//                         } else {
//                             $(`.${player}-${origin}`).removeClass(`${player}-token`);
//                             $(`.${player}-${destination}`).addClass(`${player}-token`);
//                         }
//                         if (origin == 0) {
//                             console.log("removing from stockpile"+ player)
//                             removeStockpile(player)
//                         }

//                         // cleanup
//                         $(".orange").off().removeClass("orange");
//                         gameTurn()
//                     })
//                 }
//             } else {
//                 console.log("no possible moves!")
//                 gameTurn()
//             }
//             roller.off()
//             roller.addClass("invisible")
//         }
//     )
// }

// function removeCounter(player: string) {
//     tokenCount[player] --
//     if (tokenCount[player] < 1) {
//         // win(player)
//         let win = true // no
//     }
// }

// function removeStockpile(player: string) {
//     stockpileCount[player] --
//     updateStockpileGraphic()
// }

// function updateStockpileGraphic() {
//     console.log("updating graphic")
//     $(".red-counter").text("O".repeat(stockpileCount["red"]))
//     $(".blue-counter").text("O".repeat(stockpileCount["blue"]))
// }

// function rollDice() {
//     let dice = $(".dice")
//     let succ = 0
//     for (let die of dice) {
//         console.log(die)
//         if (Math.floor(Math.random()*4) > 1) {
//             $(die).text("SUCCESS")
//             succ ++
//         } else {
//             $(die).text("FAIL")
//         }
//     }
//     return succ
// }

// function calcMoveOptions(number: number, player: string, stockpile: number): number[] {
//     if (number == 0) {
//         return null
//     }
//     let currentTokens = $(`.${player}-token`)
//     let currentTokensIdx
//     if (stockpile == 0) {
//         currentTokensIdx = []
//     } else {
//         currentTokensIdx = [0]
//     }
//     for (let token of currentTokens) {
//         currentTokensIdx.push(Number(token.innerText))
//     }
//     return currentTokensIdx.map(e => e+number)
// }