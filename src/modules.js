require("dotenv").config();
const {
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
// Function to extract text from HTML
function processHtml(html) {
  const trimmedString = html.replace(/<\/?[^>]+(>|$)/g, "");
  const first50Words = trimmedString.split(/\s+/).slice(0, 50);
  const resultString = first50Words.join(" ");
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
  const channel = client.channels.cache.get(process.env.channelId);
  channel.send(msg);
};

const sendQuestionMessage = (client, msg, accountName) => {
  // return [];
  const LastMessages = [];
  // get the channel
  const channel = client.channels.cache.get(process.env.channelId);
  
  // try to get any Image Urls
  const imageUrls = extractImageUrls(msg);
  if (imageUrls.length) {
    // Prepare attachments (up to 2 images)
    const attachments = imageUrls
      .slice(0, 2)
      .map((url) => new AttachmentBuilder(url, { name: "image.png" }));

    // Send the message with attachments
    channel
      .send({
        content: accountName,
        files: attachments,
      })
      .then((sentMessage) => {
        LastMessages.push(sentMessage);
      });
      
  } else {
    const textContent = processHtml(msg);
    channel
      .send(
        `${accountName} 
      ${textContent}`
      )
      .then((sentMessage) => {
        LastMessages.push(sentMessage);
      });
  }
  return LastMessages;
};

const dryRUN = async (client, accounts) => {
  const channel = client.channels.cache.get(process.env.testChannelId);
  for (let account of accounts) {
    try {
      const data = await account.fetchDataFromApi();
      channel.send(account.name);
      channel.send(JSON.stringify(data).slice(0, 175));
    } catch (error) {
      console.log(error);
    }
  }
};

const sendButtons = (msg, cookies) => {
  if (msg.author.bot) {
    return;
  }
  // split the buttons into chunks of 4 because max button limit is 5
  const total = cookies.length;
  let i = 0;
  while (i < total) {
    // buttons row
    let row = new ActionRowBuilder();
    let j = 0;
    while (j < 4 && i < total) {
      const cookie = cookies[i];
      const skip_buttons = new ButtonBuilder()
        .setCustomId(cookie.name)
        .setLabel(cookie.name)
        .setStyle(ButtonStyle.Danger);

      row.addComponents(skip_buttons);
      j++;
      i++;
    }
    msg
      .reply({
        content: "Skip The Question??",
        components: [row],
      })
      .then((res) => {
        console.log("Buttons Sent");
      });
  }
};

module.exports = { sendMessage, sendQuestionMessage, dryRUN, sendButtons };
