// @ts-check
"use strict";

const { createServer } = require("http");
const { Server } = require("socket.io");
const { log } = require("console");
const { setAUTH, updateAUTH, createRound, getPrompts } = require("./functions");
const { v4: uuidv4 } = require("uuid");
const { AUTH, CHALLENGES } = require("./constants");

let loop;
let mode;
let hasStarted = false;
// absolute number of total matches (till 7), i.e. an encounter consisting of MAX_ROUNDS
let currentBattle = 1;

let socketIdAdmin;
let socketIdProjector;
let player0HasPrompted = false;
let player1HasPrompted = false;
let player0HasScribbled = false;
let player1HasScribbled = false;
let player0Image;
let player1Image;

let promptBattle = {};

const renew = () => {
	mode = undefined;
	hasStarted = false;

	socketIdAdmin = undefined;
	socketIdProjector = undefined;
	player0HasPrompted = false;
	player1HasPrompted = false;
	player0HasScribbled = false;
	player1HasScribbled = false;
	player0Image = undefined;
	player1Image = undefined;
	// promptBattle has already been created

	// AUTH[1].uuid = uuidv4().slice(24);
	AUTH[1].socketId = null;
	AUTH[1].name = null;
	AUTH[1].ready = false;

	// AUTH[1].uuid = uuidv4().slice(24);
	AUTH[2].socketId = null;
	AUTH[2].name = null;
	AUTH[2].ready = false;
};

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
				socketIdAdmin = socket.id;
				break;
			}
			case "PROJECTOR": {
				io.to(socket.id).emit("s:setPlayerNames", {
					playerName0: AUTH[1].name || "",
					playerName1: AUTH[2].name || "",
				});
				socketIdProjector = socket.id;
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
				getPrompts(CHALLENGES, currentBattle - 1)
			);
		}
	});

	socket.on("a:setMode", ({ mode: data }) => {
		mode = data;

		io.emit("s:setMode", data);
	});

	// ------------------------------------------------------- Client
	socket.on("c:requestEvent", (ev) => {
		switch (ev) {
			case "s:sendPromptBattle": {
				io.to(socket.id).emit("s:sendPromptBattle", promptBattle);
				break;
			}
			case "s:getName": {
				io.to(socket.id).emit("s:getName", AUTH);
				break;
			}
		}
	});

	socket.on("c:sendRoute/prompt", (id) => {
		if (id === "1") player0HasPrompted = true;
		if (id === "2") player1HasPrompted = true;

		if (player0HasPrompted && player1HasPrompted) {
			io.to(socketIdAdmin).emit("s:sendRoute/prompt");
		}
	});

	socket.on("c:sendRoute/scribble", (id) => {
		if (id === "1") player0HasScribbled = true;
		if (id === "2") player1HasScribbled = true;

		if (player0HasScribbled && player1HasScribbled) {
			io.to(socketIdAdmin).emit("s:sendRoute/scribble");
		}
	});

	socket.on("c:sendImageInfo/results", (data) => {
		io.to(socketIdAdmin).emit("s:sendImageInfo/results", data);
	});

	socket.on("c:sendImage/results", ({ id, image }) => {
		if (id === "1") player0Image = image;
		if (id === "2") player1Image = image;

		if (socketIdProjector) {
			io.to(socketIdProjector).emit("s:sendImage/results", {
				player0Image,
				player1Image,
			});
		}
	});

	// ------------------------------------------------------- Admin
	socket.on("a:requestEvent", (ev) => {
		switch (ev) {
			case "s:sendBattleData": {
				io.emit("s:sendBattleData", {
					player0Score: promptBattle.player0Score,
					player1Score: promptBattle.player1Score,
					guuid: promptBattle.guuid,
				});
				break;
			}
			case "s:sendImage/results": {
				io.emit("s:sendImage/results", {
					player0Image,
					player1Image,
				});
				break;
			}
			case "s:prepareNextRound": {
				let isNextMatch =
					promptBattle.currentRound > promptBattle.maxRounds;

				let message;

				/**
				 * This will be sent to both the client and the admin. But here,
				 * only the admin has to be informed about the next round.
				 *
				 * -> localhost:1405/prompt?...
				 * -> localhost:5173/
				 */
				if (isNextMatch) {
					currentBattle++;
					promptBattle = createRound(
						AUTH,
						getPrompts(CHALLENGES, currentBattle - 1)
					);

					message = "round=new";
				} else {
					message = "round=current";
				}

				io.to(socketIdAdmin).emit("s:prepareNextRound", message);

				break;
			}
		}
	});

	socket.on(
		"a:sendBattleData/admin/achoose",
		({ player0Score: score0, player1Score: score1 }) => {
			promptBattle.player0Score = score0;
			promptBattle.player1Score = score1;

			promptBattle.currentRound++;
			const MAX_ROUNDS = promptBattle.maxRounds; // promptBattle.maxRounds

			// z.B. 4
			if (promptBattle.currentRound > MAX_ROUNDS) {
				let idWinner =
					promptBattle.player0Score > promptBattle.player1Score
						? "1"
						: "2";

				io.emit("s:sendGameStats", idWinner);
				return;
			}

			// z.B. 1, 2, 3
			if (promptBattle.currentRound <= MAX_ROUNDS) {
				// promptBattle = createRound(
				// 	AUTH,
				// 	getPrompts(CHALLENGES, currentRound)
				// );

				io.emit("s:sendGameStats");
				return;
			}
		}
	);

	socket.on("a:prepareNextRound", (message) => {
		io.emit("s:prepareClient", message);

		if (message == "round=new") {
			renew();
		}
	});

	// ------------------------------------------------------- PROJECTOR
	socket.on("p:requestEvent", (ev) => {
		switch (ev) {
			case "s:sendPromptBattle": {
				io.to(socket.id).emit("s:sendPromptBattle", promptBattle);
				break;
			}
			case "s:sendMode": {
				io.to(socket.id).emit("s:sendMode", mode);
				break;
			}
		}
	});

	socket.on("a:setProjector/projector/", () => {
		io.to(socketIdProjector).emit("s:setProjector/projector/");
	});

	socket.on("c:sendClientPrompt", (args) => {
		io.to(socketIdProjector).emit("s:sendClientPrompt", args);
	});

	socket.on("a:sendImageChoice", (id) => {
		io.to(socketIdProjector).emit("s:sendImageChoice", id);
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
	log("promptBattle", promptBattle.prompts);
}, 1000);

httpServer.listen(3000);
