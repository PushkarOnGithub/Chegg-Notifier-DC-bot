const { Client, IntentsBitField } = require('discord.js');
const accountss = require('./accounts');
const User = require('./user');

require('dotenv').config();

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
] });

client.on('ready', () => {
    console.log("Bot Ready!!");
});

client.on('messageCreate', (msg) => {
    if(msg.author.bot) return;
    if(msg.content === "hello" || msg.content === "Hello" || msg.content === "Hii" || msg.content === "hii"){
        msg.reply("Hey!! How are you Today");
    }
});

const accounts = [];

for(let i = 0;i<accountss.length;i++){
  const account = new User(accountss[i].name, accountss[i].options, {}, Math.floor(Date.now()/1000));
  accounts.push(account);
}


const sendErrorMessage = (msg) => {
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send(msg);
}

const sendQuestionMessage = (msg) => {
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send(msg);
}

const waitTimeSec = 10;
const extraTime = 10*60;

setInterval(async () => {
  for(let i = 0;i<accounts.length;i++){
    let account = accounts[i];
    if(account.timeToCheck >= (Math.floor(Date.now()/1000))){
        console.log("Continued in ", account.name); // remove
        continue;
    }
    try {
        let data = await account.fetchDataFromApi()
    
    // Check data is fetched if not continue to next account;
    if(!data){
        console.log("There is some problem fetching data in ", account.name);
        continue;
    }

    // If data don't have a question : continue
    if (data.errors){
        console.log( account.name , "Waiting for 1 minute...");
        sendErrorMessage("No Question is there"); // remove
        continue;
    }
    // Check if newData and lastData are equal
    if(JSON.stringify(data) != JSON.stringify(account.lastData)){
        console.log("Either data are equal or there is no fetched Data");
        account.updateLastData(data);
        account.updateTimeToCheck(Math.floor(Date.now()/1000)+extraTime);
        continue;
    }
    // If data have a question : send a message by the bot
    sendQuestionMessage(account.name, " You have a question");

    } catch (error) {
        console.error('Some error occured:', error);
    }}
}, waitTimeSec * 1000); // Convert time to milliseconds



client.login(process.env.TOKEN); 