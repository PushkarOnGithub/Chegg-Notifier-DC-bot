require("dotenv").config();
const {
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { extractImageUrls, processHtml } = require("./htmlUtils");

function sendMessage(client, msg) {
  try {
    const channel = client.channels.cache.get(process.env.channelId);
    if (!channel) throw new Error("Channel not found");
    channel.send(msg);
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

function sendQuestionMessage(client, questionBody, msgText) {
  // return [];
  const LastMessages = [];
  // get the channel
  const channel = client.channels.cache.get(process.env.channelId);

  // try to get any Image Urls
  const imageUrls = extractImageUrls(questionBody);
  if (imageUrls.length) {
    // Prepare attachments (up to 2 images)
    const attachments = imageUrls
      .slice(0, 2)
      .map((url) => new AttachmentBuilder(url, { name: "image.png" }));

    // Send the message with attachments
    channel
      .send({
        content: msgText,
        files: attachments,
      })
      .then((sentMessage) => {
        LastMessages.push(sentMessage);
      });
  } else {
    const textContent = processHtml(questionBody);
    channel
      .send(
        `${msgText} 
      ${textContent}`
      )
      .then((sentMessage) => {
        LastMessages.push(sentMessage);
      });
  }
  return LastMessages;
}

function sendButtons(client, accounts) {
  // split the buttons into chunks of 4 because max button limit is 5
  const total = accounts.length;
  try {
    let i = 0;
    while (i < total) {
      // buttons row
      let row = new ActionRowBuilder();
      let j = 0;
      while (j < 4 && i < total) {
        const name = accounts[i].name;
        const skip_buttons = new ButtonBuilder()
          .setCustomId(name)
          .setLabel(name)
          .setStyle(ButtonStyle.Danger);

        row.addComponents(skip_buttons);
        j++;
        i++;
      }
      const channel = client.channels.cache.get(process.env.controlChannelId);
      channel
        .send({
          content: "Skip The Question??",
          components: [row],
        })
        .then((res) => {
          console.log("Buttons Sent");
        });
    }
  } catch (e) {
    console.log("Error in DRYRUN", e.message);
  }
}

module.exports = { sendMessage, sendQuestionMessage, sendButtons };
