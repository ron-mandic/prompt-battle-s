function setAUTH(auth, socketId) {
	const player0 = auth[1];
	const player1 = auth[2];

	if (player0.socketId === null && player1.socketId === null) {
		player0.socketId = socketId;
		return 1;
	} else if (player0.socketId !== null && player1.socketId === null) {
		player1.socketId = socketId;
		return 2;
	} else if (player0.socketId === null && player1.socketId !== null) {
		player0.socketId = socketId;
		return 1;
	}

	return;
}

function updateAUTH(auth, socketId, reason) {
	const player0 = auth[1];
	const player1 = auth[2];
	const hasRouted = reason === "client namespace disconnect";

	if (player0.socketId === socketId) {
		player0.socketId = null;
		if (!hasRouted) player0.name = null;
		if (!hasRouted) player0.ready = false;
	}
	if (player1.socketId === socketId) {
		player1.socketId = null;
		if (!hasRouted) player1.name = null;
		if (!hasRouted) player1.ready = false;
	}
	return;
}

module.exports = {
	setAUTH,
	updateAUTH,
};
