import { Room, Delayed, Client } from 'colyseus';
import { State } from './State';

const TURN_TIMEOUT = 10
const BOARD_WIDTH = 3;


export class Ur extends Room<State> {
  maxClients = 2;
  randomMoveTimeout: Delayed;

  onCreate () {
    this.setState(new State());
    this.onMessage("action", (client, message) => this.playerAction(client, message));
  }

  onJoin (client: Client) {
    this.state.players.set(client.sessionId, true);

    if (this.state.players.size === 2) {
      this.state.currentTurn = client.sessionId;

      // lock this room for new users
      this.lock();
    }
  }

  playerAction (client: Client, data: any) {
    if (this.state.winner || this.state.draw) {
      return false;
    }
  }
}