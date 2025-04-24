const { Client, IntentsBitField } = require('discord.js');
const User = require('./user');
const { sendMessage, sendButtons } = require('./utils/discordMessageUtils');
const { dryRUN } = require('./utils/dryRunUtils');
const { getCollection } = require('./firebase');
const handleNewQuestions = require('./utils/handleNewQuestions');
const handleAnswers = require('./utils/handleAnswers');

require('dotenv').config();

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
] });

client.on('ready', () => {
    console.log(`${client.user.tag} Bot Ready!!`);
    initialiseOrUpdateAccounts();
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
        initialiseOrUpdateAccounts();
        setTimeout(() => dryRUN(client, accounts), 5000);
        setTimeout(() => sendButtons(client, accounts), 15000);
        return;
    }
    // Send buttons if in control channel
    if (content === "buttons" && isControlChannel) {
        return sendButtons(client, accounts);
    }
});

let accounts = [];
// Initialise accounts or update accounts with new cookies
async function initialiseOrUpdateAccounts(){
    let cookies = await getCollection(process.env.cookiesCollectionName);
    if (accounts.length == 0){
        console.log("Accounts initialised");
        for(let cookie of cookies){
            const account = new User(cookie.name, cookie.cookie);
            accounts.push(account);
            console.log(cookie.name);
        }
    }else{
        console.log("Cookies updated");
        for(let account of accounts){
            for(let cookie of cookies){
                if(account.name == cookie.name){
                    account.updateCookie(cookie.cookie);
                    console.log(cookie.name);
                    break;
                }
            }
        }
    }
}
let totalSkipped = 0;
client.on('interactionCreate', async (interaction) => {
    // if msg is not from correct instance of bot -> return
    if (![process.env.controlChannelId, process.env.channelId].includes(interaction.channelId)) return;
    // if msg is not a button click -> return
    if (!interaction.isButton()) return;
    for(let account of accounts){
        if(account.name == interaction.customId){
            totalSkipped++;
            // Skip the question
            if(account.lastMessages.length > 0){
                await account.skipQuestion();
                interaction.reply(`${account.name} : skipped`);
                client.channels.cache.get(process.env.channelId).bulkDelete(account.lastMessages);
                account.updateLastMessages([]);
                account.updateTimeToCheck(0);
            }else{
                interaction.reply(`${account.name} : No Question to Skip`);
            }
            break;
        }
    }
    // Send buttons again after 5 skips
    if(totalSkipped >= 5){
        setTimeout(() => {
            sendButtons(client, accounts);
        }, 2*1000);
        totalSkipped = 0;
    }
  });

// Constants
const waitTimeSec = parseInt(process.env.waitTimeSec) || 30;
const extraTime = parseInt(process.env.extraTime) || 2*60;
const wakeTime = parseInt(process.env.wakeTime) || 6;
const timeZone = parseInt(process.env.timeZone) || 5;
let on = 1;
let forceOn = 0;
let msgSent = 0;
let currHours = (new Date().getHours()+timeZone)%24;

// Loop every (waitTime) seconds
setInterval(async () => {
    // update cookies every hour at around XX:30
    if (new Date().getMinutes() <= waitTimeSec/60){
        initialiseOrUpdateAccounts();
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
    if (currHours == 14){  // at 2.30 PM
        handleLimitChanges();
        // handleAnswers(client, accounts);
    }
    // if anyhow bot is on
    if(on || forceOn){
        handleNewQuestions(client, accounts, extraTime, waitTimeSec);
    }
}, waitTimeSec * 1000); // Convert time to milliseconds


async function handleLimitChanges(){
    for(let account of accounts){
        const limitData = await account.getLimit();
        const newLimit = limitData?.data?.expertAnsweringLimit?.currentLimit;
        if (newLimit && account.limit != newLimit){
            account.updateLimit(newLimit);
            sendMessage(client, "❗❗ Attention ❗❗");
            sendMessage(client, `${account.name} Limit Changed to : ${newLimit}`);
            console.log(`${account.name} Limit Changed to : ${newLimit}`);
        }
    }
}

client.login(process.env.DISCORD_TOKEN);