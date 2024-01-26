const { Client, IntentsBitField } = require('discord.js');

require('dotenv').config();

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
] });
client.on('ready', () => {
    console.log(`${client.user.tag} Bot Ready!!`);
});

const htmlContent = "<div><p>In each of the following problems, sketch the graph of </p><code class=\"asciimath\">f(y)</code><p> versus </p><code class=\"asciimath\">y</code><p>, find the steady states, and classify each one as asymptotically stable, asymptotically unstable, or semi-stable. Draw the phase line, and sketch several graphs of solutions in the </p><code class=\"asciimath\">ty</code><p>-plane. Here </p><code class=\"asciimath\">y_(0)=y(0)</code><p>. You should consider concavity to help sketch the solutions. </p><code class=\"asciimath\">5.1(dy)/(dt)=ay+by^(2),a&gt;0,b&gt;0,-\\infty =0 5.3(dy)/(dt)=-k(y-1)^(2),k&gt;0,-\\infty </code></div><div><img src=\"https://media.cheggcdn.com/media/6e9/6e9ee41b-73c1-446d-9b1f-85e83270a594/Screenshot2024-01-25at9.26.26PM.png\" /></div>"

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
const msg = htmlContent;
const sendQuestionMessage = (client, msg, accountName) => {
    // const textContent = processHtml(msg);
    const imageUrls = extractImageUrls(msg);
    // get the channel
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send("testing");
    // for(let i = 0;i<imageUrls.length;i++){
    //     const imageUrl = imageUrls[i];
    //     channel.send('', { files: [imageUrl] });
    //     console.log("msg sent");
    //     console.log(imageUrl);
    // }
}
sendQuestionMessage(client,msg,"");

client.login(process.env.TOKEN); 