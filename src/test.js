const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
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

  const skip_button = new ButtonBuilder()
      .setCustomId("skip")
      .setLabel("Skip")
      .setStyle(ButtonStyle.Danger);
  const skip_button2 = new ButtonBuilder()
      .setCustomId("skip2")
      .setLabel("Skip")
      .setStyle(ButtonStyle.Danger);
  const solve_button = new ButtonBuilder()
      .setCustomId("solve")
      .setLabel("Solve")
      .setStyle(ButtonStyle.Success);
  const row = new ActionRowBuilder()
			.addComponents(skip_button, solve_button, skip_button2);

  const mess = msg.reply({
    content: "Skip The Question??",
    components: [row],
  });
  mess.then((res)=>{console.log(res);});
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;
  console.log("clicked");

  // if (interaction.customId === 'skip') {
  //     await interaction.reply('Button clicked!');
  // }
});

client.login(process.env.TOKEN); 