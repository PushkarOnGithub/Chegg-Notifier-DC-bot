// Function to extract text from HTML
function processHtml(html) {
    return html.replace(/<\/?[^>]+(>|$)/g, '');
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
    // const imageUrls = extractImageUrls(msg); //TODO
    // get the channel
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send(accountName + " You have a question‼️");
    channel.send(textContent);
    // channel.send("To skip use skip="+accountName);   //TODO
}

module.exports = { "sendMessage": sendMessage, "sendQuestionMessage": sendQuestionMessage};