const { v4: uuidv4 } = require("uuid");

const URL_ADMIN = "http://localhost:5173"; // "http://192.168.178.30:5173"
const URL_PLAYER1 = "http://localhost:1405"; // "http://192.168.178.10:1405"
const URL_PLAYER2 = "http://localhost:1405"; // "http://192.168.178.20:1405"
const URL_ORIGINS = [URL_ADMIN, URL_PLAYER1, URL_PLAYER2];

const SERVER_PORT = 3000;

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

const CHALLENGES = [
	// V, 0
	"Design a cozy reading nook for a small apartment.",
	"Create a character design for a friendly alien creature.",
	"Invent a high-tech gadget for organizing daily tasks and reminders.",
	// V, 1
	"Design a fantasy map of a magical kingdom with diverse landscapes.",
	"Illustrate a scene from a classic fairy tale with a modern twist.",
	"Create a concept for a futuristic cityscape with advanced technology.",
	// V, 2
	"Design a whimsical underwater world inhabited by colorful sea creatures.",
	"Illustrate a peaceful countryside scene with rolling hills and grazing animals.",
	"Invent a flying vehicle for personal transportation in a steampunk universe.",
	// V, 3
	"Design a cozy coffee shop interior with warm lighting and comfortable seating.",
	"Create a character design for a young superhero with unique powers.",
	"Illustrate a bustling marketplace in a bustling medieval town.",
	// H, 0
	"Invent a time-traveling device disguised as an ordinary object.",
	"Design a futuristic space station orbiting a distant planet.",
	"Illustrate a scene from a dystopian future where nature has reclaimed the city.",
	// H, 1
	"Create a concept for a floating island city in the clouds.",
	"Design a magical forest inhabited by mythical creatures like unicorns and fairies.",
	"Illustrate a scene from a post-apocalyptic world overrun by robots.",
	// F, 0
	"Invent a device for communicating with animals in the wilderness.",
	"Design a cozy cabin interior nestled in the mountains.",
	"Create a character design for a mischievous forest sprite.",

	"Illustrate a scene from a science fiction story set on a distant planet.",
	"Invent a device for harvesting energy from renewable sources.",
	"Design a futuristic vehicle for exploring alien landscapes.",

	"Illustrate a scene from a cyberpunk cityscape with neon lights and towering skyscrapers.",
	"Create a character design for a wise old wizard living in a hidden tower.",
	"Design a steampunk-inspired laboratory filled with intricate machinery.",

	"Illustrate a scene from a fantasy adventure story with dragons and knights.",
	"Invent a device for translating languages in real-time.",
	"Design a futuristic skyscraper with sustainable features like green roofs and solar panels.",

	"Illustrate a scene from a time-traveling adventure to ancient civilizations.",
	"Create a character design for a robot companion with a quirky personality.",
	"Design a floating cityscape above a vast ocean with futuristic architecture.",

	"Illustrate a scene from a magical journey through a mysterious forest.",
	"Invent a device for exploring the depths of the ocean and discovering new species.",
	"Design a cozy bedroom interior with soft lighting and plush furnishings.",

	"Create a concept for a whimsical playground in a children's park.",
	"Illustrate a scene from a day at the beach with sandcastles and seashells.",
	"Design a cute and cuddly mascot for a local charity or organization.",

	"Invent a simple yet ingenious tool for solving everyday household problems.",
	"Create a character design for a lovable animal sidekick in a children's story.",
	"Illustrate a scene from a picnic in the park with friends and family.",

	"Design a colorful and vibrant poster for a music festival or concert.",
	"Invent a fun and interactive toy for young children to play with.",
	"Create a character design for a cheerful and adventurous explorer.",

	"Illustrate a scene from a day at the carnival with rides and games.",
	"Design a charming and inviting storefront for a small boutique or shop.",
	"Invent a whimsical creature that could inhabit a magical forest.",

	"Create a concept for a cute and quirky cafe for pet owners and their furry friends.",
	"Illustrate a scene from a whimsical tea party with talking animals and magical treats.",
	"Design a playful and imaginative cover for a children's book.",

	"Invent a fantastical mode of transportation for traveling to far-off lands.",
	"Create a character design for a friendly monster living under the bed or in the closet.",
	"Illustrate a scene from a fun-filled day at a theme park with roller coasters and attractions.",
];

module.exports = {
	SERVER_PORT,
	URL_ADMIN,
	URL_PLAYER1,
	URL_PLAYER2,
	URL_ORIGINS,
	AUTH,
	MAX_ROUNDS,
	CHALLENGES,
};
