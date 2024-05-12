// @ts-check
"use strict";

const { createServer } = require("http");
const { Server } = require("socket.io");
const { log } = require("console");
const { setAUTH, updateAUTH, createRound, getPrompts } = require("./functions");
const { AUTH, MAX_ROUNDS, CHALLENGES } = require("./constants");

let loop;
let mode;
let hasStarted = false;
let currentRound = 0; // absolute number of rounds (till 6)

let promptBattle = {};

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
			case "ADMIN": {
				io.to(socket.id).emit("s:setPlayerNames", {
					playerName0: AUTH[1].name || "",
					playerName1: AUTH[2].name || "",
				});
				break;
			}
			case "PROJECTOR": {
				io.to(socket.id).emit("s:setPlayerNames", {
					playerName0: AUTH[1].name || "",
					playerName1: AUTH[2].name || "",
				});
				break;
			}
			default: {
				AUTH[id].socketId = socket.id;
				break;
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

			promptBattle = createRound(
				AUTH,
				getPrompts(CHALLENGES, currentRound)
			);
		}
	});

	socket.on("a:setMode", ({ mode: data }) => {
		mode = data;

		io.emit("s:setMode", data);
	});

	socket.on("c:requestEvent", (ev) => {
		switch (ev) {
			case "s:sendPromptBattle":
				io.to(socket.id).emit("s:sendPromptBattle", promptBattle);
				break;
		}
	});

	socket.on("a:requestEvent", (ev) => {
		switch (ev) {
			case "s:sendBattleData":
				io.emit("s:sendBattleData", {
					player0Score: promptBattle.player0Score,
					player1Score: promptBattle.player1Score,
					guuid: promptBattle.guuid,
				});
				break;
		}
	});

	// -------------------------------------------------------

	socket.on("disconnect", (reason) => {
		updateAUTH(AUTH, socket.id, reason);
		if (reason !== "client namespace disconnect") promptBattle = {};

		io.emit("s:setPlayerNames", {
			playerName0: AUTH[1].name || "",
			playerName1: AUTH[2].name || "",
		});
	});
});

// ###########################################################

loop = setInterval(() => {
	log("AUTH", AUTH);
	// log("promptBattle", promptBattle);
}, 1000);

httpServer.listen(3000);
