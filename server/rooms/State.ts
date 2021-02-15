
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class State extends Schema {
    @type("string") currentTurn: string;
    @type({ map: "boolean" }) players = new MapSchema<boolean>();
    @type("string") winner: string;
    @type("boolean") draw: boolean;
    @type(["number"]) redPositions: number[] = new ArraySchema<number>();
    @type(["number"]) bluePositions: number[] = new ArraySchema<number>();
    @type("boolean") gameInProgress: boolean;
    @type({ map: "string" }) colours = new MapSchema<string>();
  }