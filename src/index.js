const { Client, IntentsBitField } = require('discord.js');
const cookies = require('./cookies');
const User = require('./user');
const {sendMessage, sendQuestionMessage, dryRUN, sendButtons} = require('./modules');

require('dotenv').config();

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
] });

const waitTimeSec = 120;
const extraTime = 5*60;
let on = 0;
let forceOn = 0;
let msgSent = 0;
let currHours = ((new Date(Date.now())).getHours()+5)%24;

client.on('ready', () => {
    console.log(`${client.user.tag} Bot Ready!!`);
});

client.on('messageCreate', (msg) => {
    if(msg.author.bot) return;
    if(msg.content === "hello" || msg.content === "Hello" || msg.content === "Hii" || msg.content === "hii" || msg.content == "Hi" || msg.content == "hi"){
        msg.reply("Hey!! How are you Today");
    }
    else if((msg.content === "on" || msg.content === "activate") && 0 < currHours && currHours < 8){
        forceOn = 1;
        sendMessage(client, "Hello Night Owl !!! I'm awake");
    }else if(msg.content === "off" && currHours < 8){
        on = 0;forceOn=0;
        sendMessage(client, "Good Night🛌💤");
    }else if(msg.channelId == process.env.TestChannelID && msg.content.startsWith("dryRUN")){
        dryRUN(client);
    }else if(msg.channelId == process.env.TestChannelID && msg.content.startsWith("buttons")){
        sendButtons(msg);
    }
});


const accounts = [];

for(let i = 0;i<cookies.length;i++){
    const account = new User(cookies[i].name, 0, Math.floor(Date.now()/1000), cookies[i].cookie);
  accounts.push(account);
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    for(let i = 0;i<accounts.length;i++){
        let account = accounts[i];
        if(account.name == interaction.customId){
            let skipped = account.skipQuestion();
            if(skipped){
                interaction.reply("skipped");
                setTimeout(async ()=>{await interaction.deleteReply()},10*1000)
            }
        }
    }
  });

// Loop

setInterval(async () => {
    currHours = ((new Date(Date.now())).getHours()+5)%24;
    if(currHours>=8 && !on){
        on = 1;
        forceOn = 0;
        msgSent = 0;
        if(currHours==8){
            sendMessage(client, "Morning buddies, let's get to work!!")
            console.log("morning");
        };
    }
    else if(0 < currHours && currHours < 8 && !forceOn & !msgSent){
        on = 0;
        forceOn = 0;
        msgSent = 1;
        sendMessage(client, "Bot is now sleeping, so should you 😴😴\nUse command on/activate to wake it up");
        console.log("sleeping");
    }
    // if bot is on
    if(on || forceOn){
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
            console.log( account.name , `Waiting for ${waitTimeSec} seconds...`);
            // sendMessage(client, account.name + " No Question is there"); // remove
            continue;
        }
        const queID = data.data.nextQuestionAnsweringAssignment.question.id;  // getID of fetched question
        // Check if queID and lastID are equal
        if(queID == account.lastID){
            account.updateTimeToCheck(Math.floor(Date.now()/1000)+extraTime);
            console.log(account.name ,`Waiting for ${extraTime} seconds`);
            continue;
        }
        // If data have a question : send a message by the bot
        console.log("Got a Question Updating data");
        account.updateLastID(queID);
        account.updateTimeToCheck(Math.floor(Date.now()/1000)+extraTime);
        // send new question message
        sendQuestionMessage(client, data.data.nextQuestionAnsweringAssignment.question.body, account.name);
        // try to accept the Question
        const response = await account.acceptQuestion(); 
        if(response.errors){
            sendMessage(client, "Accepted ❌");
        // }else{
        //     sendMessage(client, "Accepted ✅");
        }
        } catch (error) {
            console.error('Some error occured:', error);
        }}
}}, waitTimeSec * 1000); // Convert time to milliseconds



client.login(process.env.TOKEN); 