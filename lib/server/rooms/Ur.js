"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ur = void 0;
const colyseus_1 = require("colyseus");
const State_1 = require("./State");
const TURN_TIMEOUT = 10;
const BOARD_WIDTH = 3;
class Ur extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 2;
    }
    onCreate() {
        this.setState(new State_1.State());
        this.onMessage("action", (client, message) => this.playerAction(client, message));
    }
    onJoin(client) {
        this.state.players.set(client.sessionId, true);
        if (this.state.players.size === 2) {
            this.state.currentTurn = client.sessionId;
            // lock this room for new users
            this.lock();
        }
    }
    playerAction(client, data) {
        if (this.state.winner || this.state.draw) {
            return false;
        }
    }
}
exports.Ur = Ur;
