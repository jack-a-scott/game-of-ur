import { Room, Delayed, Client } from 'colyseus';
import { timers } from 'jquery';
import { State } from './State';

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
    let colours = ["red", "blue"];
    this.state.colours.set(client.sessionId, colours[this.state.players.size-1]);
    console.log("player joined", client.id);

    if (this.state.players.size === 2) {
      this.state.currentTurn = client.sessionId;
      this.state.gameInProgress = true;
      console.log("Setting turn to ", client.sessionId);
      // lock this room for new users
      this.lock();
      console.log("set player colours! ", this.state.colours)
      this.broadcast("hello", "this is a message to you rudy")
    }
  }

  playerAction(client: Client, message: any) {
    if (!this.state.gameInProgress) {
      console.log("illegal action by", client.id)
    }
    if (message === "roll") {
      rollDice(client, message)
    } else if (message === "move") {
      movePiece(client, message)
    }
      // await diceroll button

      // send diceroll results

      // await movechoice

      // send movechoice results

      // check for win

      // pass to other player
  }
}

function rollDice(client, message) {
  console.log("rolling")
}
function movePiece(client, message) {
  console.log("moving piece")
}