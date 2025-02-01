export class Game {
	/**
	 * Create a game object from the player's cookie, or initialise a new game
	 */
	constructor(serialized = undefined) {
		if (serialized) {
			const [index, answers] = serialized.split('-');

			this.index = +index;
			this.answers = answers ? answers.split(' ') : [];
		} else {
			this.index = Math.floor(Math.random() * 10);
			this.answers = ([]);
		}

	}

	/**
	 * This is a method, nice!
	 */
	someMethod() {
		console.log("You called a method!");
	}

	/**
	 * Serialize game state so it can be set as a cookie
	 */
	toString() {
		return `${this.index}-${this.answers.join(' ')}`;
	}
}
