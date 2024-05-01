require('dotenv').config();
const https = require('https');
const accounts = require('./accounts');
const {AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
// Function to extract text from HTML
function processHtml(html) {
    const trimmedString = html.replace(/<\/?[^>]+(>|$)/g, '');
    const first50Words = trimmedString.split(/\s+/).slice(0, 50);
    const resultString = first50Words.join(' ')
    return resultString;
}

// Function to extract image URLs from HTML
function extractImageUrls(html) {
    const regex = /<img .*?src=['"](.*?)['"].*?>/g;
    const matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        matches.push(match[1]);
    }
    return matches;
}

const sendMessage = (client, msg) => {
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send(msg);
}

const sendQuestionMessage = (client, msg, accountName) => {
    const textContent = processHtml(msg);
    // get the channel
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send(accountName + " You have a question‼️");
    // get Image Urls
    const imageUrls = extractImageUrls(msg);
    if(imageUrls.length){
        for(let i = 0;i<imageUrls.length;i++){
            const att = new AttachmentBuilder(imageUrls[i], { name: 'image.png' });
            channel.send({files: [att]});
        }
    }else{
        channel.send(textContent);
    }
}

const dryRUN = (client) => {
    const channel = client.channels.cache.get(process.env.TestChannelID);
    for(let i = 0;i<accounts.length;i++){
        const requestOptions = accounts[i].options;
    const req = https.request('https://gateway.chegg.com/nestor-graph/graphql', requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            channel.send(accounts[i].name);
            channel.send(data.slice(0, 500));
        });
        });

        req.on('error', (error) => {
        console.error('Error during DRY RUN:', error);
        channel.send("Error in request");
        });
        // If there is data to be sent in the request
        if (requestOptions.data) {
            req.write(JSON.stringify(requestOptions.data));
        }
        // End the request.
        req.end();
    }
}

const sendButtons = (msg) =>{
    if(msg.author.bot){return }

    const skip_button = new ButtonBuilder()
        .setCustomId("Lokesh")
        .setLabel("Lokesh")
        .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder()
                .addComponents(skip_button);

    const mess = msg.reply({
        content: "Skip The Question??",
        components: [row],
    });
    mess.then((res)=>{console.log("Buttons Sent");});
}

module.exports = { "sendMessage": sendMessage, "sendQuestionMessage": sendQuestionMessage, "dryRUN": dryRUN, "sendButtons": sendButtons};