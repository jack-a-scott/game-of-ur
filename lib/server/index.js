"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const colyseus_1 = require("colyseus");
const ur_1 = require("./rooms/ur");
const app = express_1.default();
const port = Number(process.env.PORT || 8080);
app.use(cors_1.default());
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const gameServer = new colyseus_1.Server({
    server: server,
    express: app
});
gameServer.define('ur', ur_1.Ur);
gameServer.listen(port);
app.use(express_1.default.static(__dirname + "/../frontend/public"));
console.log(`Listening on ws://localhost:${port}`);
