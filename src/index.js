const { Client, IntentsBitField } = require('discord.js');
const User = require('./user');
const {sendMessage, sendQuestionMessage, dryRUN, sendButtons} = require('./modules');
const { getCookies } = require('./firebase');
const {updateFirebaseCookies} = require('./fetchAndUpdateFirebaseCookies');

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
        dryRUN(client, accounts);
        setTimeout(() => sendButtons(client, accounts), 10000);
        return;
    }
    // Update Firebase cookies if in control channel and by authorized users
    if (content === "update" && isControlChannel && isAuthorizedUser) {
        updateFirebaseCookies();
        return msg.reply("Updated");
    }
    // Send buttons if in control channel
    if (content === "buttons" && isControlChannel) {
        return sendButtons(client, accounts);
    }
});

let accounts = [];
// Initialise accounts or update accounts with new cookies
async function initialiseOrUpdateAccounts(){
    let cookies = await getCookies();
    if (accounts.length == 0){
        for(let cookie of cookies){
            const account = new User(cookie.name, cookie.cookie);
            accounts.push(account);
            console.log(cookie.name);
        }
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
        }, 30*1000);
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
    // update cookies every hour at XX:30
    if (new Date().getMinutes() === 0){
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
    if (currHours == 14){  // time to check for limit changes 2.30 PM
        handleLimitChanges();
    }
    // if anyhow bot is on
    if(on || forceOn){
        handleAccounts();
    }
}, waitTimeSec * 1000); // Convert time to milliseconds



async function handleAccounts(){
    for(let account of accounts){
        if(account.goodToCheck()){
            console.log(account.name, "Continued");
            continue;
        }
        try {
            let data = await account.fetchDataFromApi()
        // Check data is fetched if not continue to next account
        if(!data){
            console.log(account.name, "There is some problem fetching data");
            continue;
        }

        if (data.errorCode == "invalid_token"){
            console.log(account.name, "Tokens Expired");
            continue;
            // TODO : notify for the invalid token
        }
        if (data.errors){
            console.log( account.name, `waiting for ${waitTimeSec} seconds...`);
            account.updateLastMessages([]);
            continue;
        }
        const que = data.data?.nextQuestionAnsweringAssignment?.question;  // get fetched question
        // Same que found again
        if(que && que.id == account.lastQuestionId){
            account.updateTimeToCheck(extraTime);
            console.log(account.name ,`waiting for ${extraTime} seconds`);
            continue;
        }
        // If data have a question : send a message by the bot
        console.log(account.name, "Got a Question Updating data");
        account.updateLastQuestionId(que.id);
        account.updateTimeToCheck(extraTime);
        // try to accept the Question
        const response = await account.acceptQuestion();
        if(response.errors){
            console.log(account.name, "Question already accepted");
        }else{
            // send new question message
            const lastMessages = sendQuestionMessage(client, que.body, account.name);
            account.updateLastMessages(lastMessages);
            console.log(account.name, "Question Sent");
        }
        } catch (error) {
            console.error('Some error occured in index.js ', error);
        }
    }
}

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

client.login(process.env.TOKEN);