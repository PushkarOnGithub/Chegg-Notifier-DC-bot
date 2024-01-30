require('dotenv').config();
const {AttachmentBuilder} = require('discord.js');
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
    // channel.send("To skip use skip="+accountName);   //TODO
}

module.exports = { "sendMessage": sendMessage, "sendQuestionMessage": sendQuestionMessage};