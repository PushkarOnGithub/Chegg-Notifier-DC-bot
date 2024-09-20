const { Client, IntentsBitField } = require('discord.js');
const User = require('./user');
const {sendMessage, sendQuestionMessage, dryRUN, sendButtons} = require('./modules');
const { getData } = require('./firebase');

require('dotenv').config();

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
] });

const waitTimeSec = 5;
const extraTime = 2*60;
const wakeTime = 6
const timeZone = 5;
let on = 1;
let forceOn = 0;
let msgSent = 0;
let currHours = ((new Date(Date.now())).getHours()+timeZone)%24;

client.on('ready', () => {
    console.log(`${client.user.tag} Bot Ready!!`);
    updateCookies();
});

client.on('messageCreate', (msg) => {
    if(msg.author.bot) return;
    // if msg is not from correct instance of bot -> return
    if(!(msg.channelId === process.env.testChannelId || msg.channelId === process.env.channelId)) return;
    if(msg.content.toLocaleLowerCase() === "hello" || msg.content.toLocaleLowerCase() === "hii" || msg.content.toLocaleLowerCase() === "hi"){
        msg.reply("Hey!! How are you Today");
    }
    else if((msg.content === "on" || msg.content === "activate") && 0 < currHours && currHours < wakeTime){
        forceOn = 1;
        msg.reply("Hello Night Owl !!! I'm awake");
    }else if(msg.content === "off" && currHours < wakeTime){
        on = 0;forceOn=0;
        msg.reply("Good Night🛌💤");
    }else if(msg.content === "dryRUN" && msg.channelId == process.env.testChannelId && (msg.author.id === "829800422633242644" || msg.author.id === "1098539236464017469")){
        dryRUN(client, accounts);
        setTimeout(() => {
            sendButtons(msg, cookies);
        }, 10000);
    }else if(msg.content === "buttons" && msg.channelId === process.env.testChannelId){
        sendButtons(msg, cookies);
    }
});

let cookies = [];
let accounts = [];

const updateCookies = async () => {
    cookies = await getData();
    if (accounts.length == 0){
        for(let cookie of cookies){
            const account = new User(cookie.name, cookie.cookie);
            accounts.push(account);
        }
        console.log("Accounts Initialised")
    }else{
        for(let i = 0;i<accounts.length;i++){
            accounts[i].cookie = cookies[i].cookie;
        }
        console.log("cookies changed");
    }
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    for(let account of accounts){
        if(account.name == interaction.customId){
            let skipped = await account.skipQuestion();
            if(skipped){
                interaction.reply(`${account.name} : skipped`);
                client.channels.cache.get(process.env.channelId).bulkDelete(account.lastMessages);
                account.updateLastMessages([]);
                account.updateTimeToCheck((Math.floor(Date.now()/1000)));
                setTimeout(async ()=>{await interaction.deleteReply()},60*1000);
            }
            break;
        }
    }
  });

// Loop

setInterval(async () => {
    if ((new Date(Date.now())).getMinutes() === 0){
        updateCookies();
    }
    currHours = ((new Date(Date.now())).getHours()+timeZone)%24;
    
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
            console.log( account.name , `Waiting for ${waitTimeSec} seconds...`);
            account.updateLastMessages([]);
            // sendMessage(client, account.name + " No Question is there"); // remove
            continue;
        }
        const que = data.data.nextQuestionAnsweringAssignment.question;  // get fetched question
        // Check if queID and lastID are equal
        if(que.id == account.lastID){
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