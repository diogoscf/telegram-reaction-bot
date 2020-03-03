# Telegram Reaction Bot

A telegram bot made with `node.js` that reacts to messages containing defined strings with defined reactions.

## Usage

### Setup

To use the bot, make sure to set up a bot with [@BotFather](https://t.me/BotFather) and paste the provided token in the `.env` file (after `TOKEN=`).

Then, to define your reactions, create a `reactions.json` file where you'll provide the messages to react to and the reactions. Note that the saved string will be interpreted as a regular expression, so you may use `regex` to get the results you want. An example of formatting can be found in the `example-reactions.json` file

### Running

To run, make sure you have `npm` installed and run `npm start`


## Licensing

This project is licensed under the MIT license. Check the `LICENSE` file for details
