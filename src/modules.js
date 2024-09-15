require('dotenv').config();
const https = require('https');
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

const sendMessage = (client, msg, channelId) => {
    const channel = client.channels.cache.get(channelId);
    channel.send(msg);
}

const sendQuestionMessage = (client, msg, accountName) => {
    // get the channel
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send(accountName); // specify the account
    // get Image Urls
    const imageUrls = extractImageUrls(msg);
    if(imageUrls.length){
        for(let i = 0;i<imageUrls.length;i++){
            const att = new AttachmentBuilder(imageUrls[i], { name: 'image.png' });
            channel.send({files: [att]});
        }
    }else{
        const textContent = processHtml(msg);
        channel.send(textContent);
    }
}

const dryRUN = (client, cookies) => {
    const channel = client.channels.cache.get(process.env.TestChannelID);
    for(let cookie of cookies){
        const requestOptions = {
            "method": "POST",
            "data":{
                operationName: 'NextQuestionAnsweringAssignment',
                variables: {},
                query: 'query NextQuestionAnsweringAssignment {\n  nextQuestionAnsweringAssignment {\n    question {\n      body\n      id\n      uuid\n      subject {\n        id\n        name\n        subjectGroup {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      imageTranscriptionText\n      lastAnswerUuid\n      questionTemplate {\n        templateName\n        templateId\n        __typename\n      }\n      __typename\n    }\n    langTranslation {\n      body\n      translationLanguage\n      __typename\n    }\n    legacyAnswer {\n      id\n      body\n      isStructuredAnswer\n      structuredBody\n      template {\n        id\n        __typename\n      }\n      __typename\n    }\n    questionGeoLocation {\n      countryCode\n      countryName\n      languages\n      __typename\n    }\n    questionRoutingDetails {\n      answeringStartTime\n      bonusCount\n      bonusTimeAllocationEnabled\n      checkAnswerStructureEnabled\n      hasAnsweringStarted\n      questionAssignTime\n      questionSolvingProbability\n      routingType\n      allocationExperimentId\n      questionQualityFactor\n      routingTag\n      __typename\n    }\n    __typename\n  }\n}'
            },
            "headers": {
              "Content-Type": "application/json",
              "Apollographql-Client-Name": "chegg-web-producers",
              "Cookie": cookie.cookie
            }};
    const req = https.request('https://gateway.chegg.com/nestor-graph/graphql', requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            channel.send(cookie.name);
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

const sendButtons = (msg, cookies) =>{
    if(msg.author.bot){return };
    // buttons row
    let row = new ActionRowBuilder();
                
    for(let cookie of cookies){
        const skip_button = new ButtonBuilder()
            .setCustomId(cookie.name)
            .setLabel(cookie.name)
            .setStyle(ButtonStyle.Danger);
            
            row.addComponents(skip_button);
    }
    const mess = msg.reply({
        content: "Skip The Question??",
        components: [row],
    });
    mess.then((res)=>{console.log("Buttons Sent");});
}

module.exports = { sendMessage, sendQuestionMessage, dryRUN, sendButtons};