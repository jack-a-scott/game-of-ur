import { Room, Delayed, Client } from 'colyseus';
import { timers } from 'jquery';
import { State, CounterPositions } from './State';

const TURN_TIMEOUT = 10
const BOARD_WIDTH = 3;


export class Ur extends Room<State> {
  maxClients = 2;
  randomMoveTimeout: Delayed;

  onCreate () {
    console.log("Room created!")
    this.setState(new State());
    this.onMessage("action", (client, message) => this.playerAction(client, message));
  }

  async onJoin (client: Client) {
    this.state.players.set(client.sessionId, true);
    // let colours = ["red", "blue"];
    // this.state.colours.set(client.sessionId, colours[this.state.players.size-1]);
    console.log("player joined", client.id);
    this.state.stockpiles[client.sessionId] = 7
    this.state.counterPositions.set(client.sessionId, new CounterPositions({positions: [0,1,2], player: client.sessionId}))
    console.log(this.state.counterPositions[client.sessionId].positions)

    if (this.state.players.size === 2) {
      this.lock(); // lock any additional players out

      this.state.currentTurn = client.sessionId;
      this.state.diceRolls = [0,0,0,0];
      console.log("Setting turn to ", client.sessionId);
      // lock this room for new users
      // broadcast clients to check initial game states
      this.state.gameInProgress = true;
      console.log("Initial State", this.state.counterPositions)
      this.broadcast("beginGame", "server broadcasting players to begin the game")
    }
  }

  playerAction(client: Client, message: any) {
    // do nothing if we're being sent an action by a player whose turn it isn't
    if (!this.state.gameInProgress || !(this.state.currentTurn === client.sessionId)) {
      console.log("illegal action by", client.id)
    }
    if (message === "roll") {
      // the UI roll elements are updated VIA state, but we handle the success data explicitly by MESSAGE
      let rollSuccesses = this.rollDice(client)
      let allowedMoves = this.computeAllowedMoves(client, rollSuccesses)
      client.send("allowedMoves", allowedMoves)
    } else if (message === "chosenMove") {
      movePiece(client, message)
    }

      // await movechoice

      // send movechoice results

      // check for win

      // pass to other player
  }

  rollDice(client) {
    let results: number[]
    let successes: number = 0;
    for (let idx of Array(4).keys()) {
      let roll = Math.floor(Math.random()*4)
      this.state.diceRolls[idx] = roll
      if (roll > 1) {
        successes ++
      }
    }
    return successes
  }

  computeAllowedMoves(client: Client, rollSuccesses: number) {
    if (rollSuccesses == 0) {
      return null
    }
    let playerStockpile = this.state.stockpiles[client.sessionId]
    let currentTokensIdx = playerStockpile == 0 ? [] : [0]
    for (let token of this.state.counterPositions[client.sessionId]) {
      currentTokensIdx.push(Number(token.innerText))
    }
    return currentTokensIdx.map(e => e + rollSuccesses)
  }
}


function movePiece(client, message) {
  console.log("moving piece!!")
}