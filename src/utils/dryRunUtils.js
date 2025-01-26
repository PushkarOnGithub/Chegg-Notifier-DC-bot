require("dotenv").config();

async function dryRUN(client, accounts) {
  const channel = client.channels.cache.get(process.env.controlChannelId);
  for (let account of accounts) {
    try {
      const data = await account.fetchDataFromApi();
      channel.send(account.name + " " + JSON.stringify(data).slice(0, 175));
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = { dryRUN };
