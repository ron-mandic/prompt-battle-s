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
	"Place yourself in a hollywood movie",
	"Create a hybrid of your favorite animal and favorite food",
	"Create a detailed portrait of your opponent!",
	'Create the wildest "motto Party"',
	"Create your spirit animal",
	"Design a chair",
	"Illustrate your last / or craziest dream",
	"How do you imagine AI?",
	"You are a biologist and discover a new species, describe it!",
	"Place yourself in an underwater motto party",
	"Create a family picture of the AI+D lab team",
	"Create as many copyright infringements as possible!",
	"HfG in a nutshell",
	"Create a logo for your next startup. Follow signature HfG style",
	"Design a new product for the smallest target group (including you)!",
	"Design an eco-friendly vacation alternative",
	"I bet, DALL-E has no idea what this is!",
	"What does Feuerzangenbowle actually mean?",
	"Recreate the letter 'A' shape without saying 'A'!",
	"Invent a new dish",
	"Create a Movie Poster for a Block Buster",
	// ...
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
