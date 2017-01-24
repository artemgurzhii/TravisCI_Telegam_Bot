import Data from '../services';

let watching = true;

/* Class representing all commands available to user. */
export default class Command {

  /**
   * Used to check user message and decide how to respond.
   * @param {Object} bot - bot object.
   * @param {string} message - received message from the user.
   */
	constructor(bot, message) {
    this.bot = bot;
    this.message = message;
  }

  // Respond to '/how' command
	how() {
		this.bot.sendMessage(this.message.from, 'You send me your Tavis CI repository link. Example: \nhttps://travis-ci.org/emberjs/ember.js \nThen I will watch for changes and will notify you each time when your build is done. \n\nI will also include some basic information about your build. \nCurrently i can watch only one repository from each user.');
	}

  // Respond to '/link' command
	link(text) {
		this.bot.sendMessage(this.message.from, text);
	}

  // Respond to '/start' command
	start() {
		watching = true;
		this.bot.sendMessage(this.message.from, 'Ok, since now I will watch for changes.');
	}

  // Respond to '/stop' command
	stop() {
		watching = false;
		this.bot.sendMessage(this.message.from, 'Ok, since now I will stop watching for changes.');
	}

  /**
   * Respond with passed argument.
   * @param {string} message - Message to send.
   */
  default(message) {
    this.bot.sendMessage(this.message.from, message);
  }

  // Respond to all other messages
  unknown() {
    this.bot.sendMessage(this.message.from, 'Unknown command.');
  }

  // Make request each 7 seconds to get data.
	data(db) {
    let request;
		let interval = setInterval(() => {
      db.forEach(user => {
        request = new Data(null, user.json);
        request.req((res, valid) => {

          if (watching && res) {
            if (!valid) {
              clearInterval(interval);
            }
            this.bot.sendMessage(user.id, res);
          }
        });
      });
		}, 10000);

		this.bot.sendMessage(this.message.from, 'Ok, since now I will watch for changes.');
	}

}
