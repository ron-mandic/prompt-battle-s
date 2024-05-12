// @ts-check
"use strict";

const { createServer } = require("http");
const { Server } = require("socket.io");
const { uuid } = require("uuidv4");
const { log } = require("console");

const MAX_PARTICIPANTS = 2;
const MAX_ROUNDS = 3;

let loop;
const mapSockets = new Map();
const mapPorts = new Map();
let player0;
let player1;
let isPlayer0Ready = false;
let isPlayer1Ready = false;
let mode;
let socketIdAdmin;
let socketIdProjector;

const httpServer = createServer();
const io = new Server(httpServer, {
	allowEIO3: true,
	transports: ["polling", "websocket"], // Erlaubte Transports
	cors: {
		origin: ["http://localhost:5173", "http://localhost:1405"],
	},
});

// ###########################################################

io.on("connection", (socket) => {
	socket.on("c:initClient", (port) => {
		if (mapSockets.size == MAX_PARTICIPANTS) return;

		mapSockets.set(socket.id, port);
		mapPorts.set(port, socket.id);

		let i = 1;
		mapSockets.forEach((_, key) => {
			io.to(key).emit("s:setPlayerNumber", i);
			i++;
		});
	});

	socket.on("disconnect", () => {
		let port = mapSockets.get(socket.id);
		if (mapSockets.has(socket.id)) mapSockets.delete(socket.id);
		if (mapPorts.has(port)) mapPorts.delete(port);
	});
});

// ###########################################################

loop = setInterval(() => {
	log("mapSockets:", mapSockets);
}, 1000);

httpServer.listen(3000);
