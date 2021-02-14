import { Schema, MapSchema } from "@colyseus/schema";
export declare class State extends Schema {
    currentTurn: string;
    players: MapSchema<boolean>;
    board: number[];
    winner: string;
    draw: boolean;
}
