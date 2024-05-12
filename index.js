// @ts-check
"use strict";

const { createServer } = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const { log } = require("console");
const { setAUTH, updateAUTH } = require("./functions");

const AUTH = {
	1: {
		id: 1,
		uuid: uuidv4().slice(24),
		socketId: null,
		name: null,
		ready: false,
	},
	2: {
		id: 2,
		uuid: uuidv4().slice(24),
		name: null,
		socketId: null,
		ready: false,
	},
};
const MAX_ROUNDS = 3;
let loop;
let mode;
let hasStarted = false;

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
	socket.on("c:initClient", (id) => {
		switch (id) {
			case undefined: {
				let i = setAUTH(AUTH, socket.id);
				io.to(socket.id).emit("s:initClient", {
					id: AUTH[i].id,
					uuid: AUTH[i].uuid,
				});
				break;
			}
			default: {
				AUTH[id].socketId = socket.id;
			}
		}
	});

	socket.on("c:setPlayerNames", ({ id, name }) => {
		AUTH[id].name = name;

		io.emit("s:setPlayerNames", {
			playerName0: AUTH[1].name || "",
			playerName1: AUTH[2].name || "",
		});
	});

	socket.on("c:setPlayerReadiness", (id) => {
		AUTH[id].ready = true;

		if (AUTH[1].ready && AUTH[2].ready) {
			hasStarted = true;
			io.emit("s:start");
		}
	});

	socket.on("a:setMode", (data) => {
		mode = data;
		io.emit("s:setMode", data);
	});

	socket.on("disconnect", (reason) => {
		updateAUTH(AUTH, socket.id, reason);
		io.emit("s:setPlayerNames", {
			playerName0: AUTH[1].name || "",
			playerName1: AUTH[2].name || "",
		});
	});
});

// ###########################################################

loop = setInterval(() => {
	log("AUTH", AUTH);
}, 1000);

httpServer.listen(3000);
