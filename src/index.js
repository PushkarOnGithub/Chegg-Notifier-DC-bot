const { Client, IntentsBitField } = require('discord.js');
const User = require('./user');
const {sendMessage, sendQuestionMessage, dryRUN, sendButtons} = require('./modules');
const { getCookies } = require('./firebase');
const updateFirebaseCookies = require('./updateAllCookies');

require('dotenv').config();

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
] });

const waitTimeSec = parseInt(process.env.waitTimeSec) || 30;
const extraTime = parseInt(process.env.extraTime) || 2*60;
const wakeTime = parseInt(process.env.wakeTime) || 6;
const timeZone = parseInt(process.env.timeZone) || 5;
let on = 1;
let forceOn = 0;
let msgSent = 0;
let currHours = (new Date().getHours()+timeZone)%24;

client.on('ready', () => {
    console.log(`${client.user.tag} Bot Ready!!`);
    updateCookies();
});

client.on('messageCreate', (msg) => {
    if(msg.author.bot) return;
    // if msg is not from correct instance of bot -> return
    const allowedChannelIds = [process.env.controlChannelId, process.env.channelId];
    if (!allowedChannelIds.includes(msg.channelId)) return;

    const content = msg.content.toLowerCase();
    const isControlChannel = msg.channelId === process.env.controlChannelId;
    const isAuthorizedUser = ["829800422633242644", "1098539236464017469"].includes(msg.author.id);

    // Greeting responses
    if (["hello", "hii", "hi"].includes(content)) {
        return msg.reply("Hey!! How are you Today");
    }
    // Night-time activation
    if ((content === "on" || content === "activate") && 0 < currHours && currHours < wakeTime) {
        forceOn = 1;
        return msg.reply("Hello Night Owl !!! I'm awake");
    }
    // Night-time deactivation
    if (content === "off" && currHours < wakeTime) {
        on = 0;
        forceOn = 0;
        return msg.reply("Good Night🛌💤");
    }
    // Execute dryRUN command if in control channel and by authorized users
    if (content === "dryrun" && isControlChannel && isAuthorizedUser) {
        updateCookies();
        dryRUN(client, accounts);
        setTimeout(() => sendButtons(client, cookies), 10000);
        return;
    }
    // Update Firebase cookies if in control channel and by authorized users
    if (content === "update" && isControlChannel && isAuthorizedUser) {
        updateFirebaseCookies();
        return msg.reply("Updated");
    }
    // Send buttons if in control channel
    if (content === "buttons" && isControlChannel) {
        return sendButtons(client, cookies);
    }
});

let cookies = [];
let accounts = [];

const updateCookies = async () => {
    cookies = await getCookies();
    if (accounts.length == 0){
        for(let cookie of cookies){
            const account = new User(cookie.name, cookie.cookie);
            accounts.push(account);
        }
        console.log(cookies);
        console.log("Accounts Initialised")
    }else{
        for(let i = 0;i<accounts.length;i++){
            accounts[i].cookie = cookies[i].cookie;
        }
        console.log("cookies changed");
    }
}
let totalSkipped = 0;
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    // if msg is not from correct instance of bot -> return
    if (![process.env.controlChannelId, process.env.channelId].includes(msg.channelId)) return;
    for(let account of accounts){
        if(account.name == interaction.customId){
            totalSkipped++;
            if(account.lastMessages.length > 0){
                await account.skipQuestion();
                interaction.reply(`${account.name} : skipped`);
                client.channels.cache.get(process.env.channelId).bulkDelete(account.lastMessages);
                account.updateLastMessages([]);
                account.updateTimeToCheck((Math.floor(Date.now()/1000)));
            }else{
                interaction.reply(`${account.name} : No Question to Skip`);
            }
            break;
        }
    }
    if(totalSkipped >= 5){
        setTimeout(() => {
            sendButtons(client, cookies);
        }, 30*1000);
        totalSkipped = 0;
    }
  });

// Loop

setInterval(async () => {
    if (new Date().getMinutes() === 0){
        updateCookies();
    }
    currHours = (new Date().getHours()+timeZone)%24;
    
    if(currHours>=wakeTime && !on){
        on = 1;
        forceOn = 0;
        msgSent = 0;
        if(currHours==wakeTime){
            sendMessage(client, "Morning buddies, let's get to work!!")
            console.log("morning");
        };
    }
    else if(0 < currHours && currHours < wakeTime && !forceOn & !msgSent){
        on = 0;
        forceOn = 0;
        msgSent = 1;
        sendMessage(client, "Bot is now sleeping, so should you 😴😴\nUse command on/activate to wake it up");
        console.log("sleeping");
    }
    // if bot is on
    if(on || forceOn){
    for(let account of accounts){
        if (currHours == 14){  // time to check for limit changes 2.30 PM
            const limitData = await account.getLimit();
            const newLimit = limitData.data.expertAnsweringLimit.currentLimit;
            if (account.limit != newLimit){
                account.updateLimit(newLimit);
                sendMessage(client, "❗❗ Attention ❗❗");
                sendMessage(client, `${account.name} Limit Changed to : ${newLimit}`);
            }
        }
        if(account.timeToCheck >= (Math.floor(Date.now()/1000))){
            console.log("Continued in ", account.name);
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
            console.log( account.name , `Waiting for ${waitTimeSec} seconds...`);
            account.updateLastMessages([]);
            continue;
        }
        const que = data.data.nextQuestionAnsweringAssignment.question;  // get fetched question
        // Check if queID and lastID are equal
        if(que.id == account.lastQuestionId){
            account.updateTimeToCheck(Math.floor(Date.now()/1000)+extraTime);
            console.log(account.name ,`Waiting for ${extraTime} seconds`);
            continue;
        }
        // If data have a question : send a message by the bot
        console.log("Got a Question Updating data");
        account.updateLastQuestionId(que.id);
        account.updateTimeToCheck(Math.floor(Date.now()/1000)+extraTime);
        // send new question message
        const lastMessages = sendQuestionMessage(client, que.body, account.name);
        account.updateLastMessages(lastMessages);
        // try to accept the Question
        const response = await account.acceptQuestion(); 
        if(response.errors){
            // sendMessage(client, "Accepted ❌");
        // }else{
        //     sendMessage(client, "Accepted ✅");
        }
        } catch (error) {
            console.error('Some error occured:', error);
        }
    }
}}, waitTimeSec * 1000); // Convert time to milliseconds



client.login(process.env.TOKEN);