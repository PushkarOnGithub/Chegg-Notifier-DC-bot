const { Client, IntentsBitField } = require('discord.js');
const {sendQuestionMessage} = require('./modules');

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

client.on('messageCreate', (msg) => {
  if(msg.author.bot){return }
  // const att = new AttachmentBuilder("https://media.cheggcdn.com/study/e35/e35566c4-9b10-4e75-a77c-aa0c70e9c42a/image", { name: 'image.png' });

  //   msg.channel.send({files: [att]});
});

const messa = "<div><p>Let </p><code class=\"asciimath\">f_(n)</code><p> be a requence of measurable functions.t show that the set </p><code class=\"asciimath\">E={(x:f_(n)(x)):}</code><p> converges </p></div><div><img src=\"https://media.cheggcdn.com/study/e35/e35566c4-9b10-4e75-a77c-aa0c70e9c42a/image\" /></div>";

sendQuestionMessage(client, messa, "test");

client.login(process.env.TOKEN); 