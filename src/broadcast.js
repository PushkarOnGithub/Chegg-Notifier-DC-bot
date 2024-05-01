const { Client, IntentsBitField } = require('discord.js');
const {sendMessage } = require('./modules');

require('dotenv').config();

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
] });

let message = "Bye Bye Utsav👋👋 You will be missed 🥹🥹"

client.on('ready', () => {
    console.log(`${client.user.tag} Bot Ready!!`);
    sendMessage(client, message);
});

client.login(process.env.TOKEN); 