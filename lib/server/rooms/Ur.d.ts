import { Room, Delayed, Client } from 'colyseus';
import { State } from './State';
export declare class Ur extends Room<State> {
    maxClients: number;
    randomMoveTimeout: Delayed;
    onCreate(): void;
    onJoin(client: Client): void;
    playerAction(client: Client, data: any): boolean;
}
