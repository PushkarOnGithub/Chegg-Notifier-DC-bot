const sendQuestionMessage = require("./discordMessageUtils");

async function handleNewQuestions(accounts, client, extraTime, waitTimeSec) {
  for (let account of accounts) {
    if (account.goodToCheck()) {
      console.log(account.name, "Continued");
      continue;
    }
    try {
      let data = await account.fetchDataFromApi();

      // Check data is fetched if not continue to next account
      if (!data) {
        console.log(account.name, "There is some problem fetching data");
        continue;
      }

      if (data.errorCode == "invalid_token") {
        console.log(account.name, "Tokens Expired");
        continue;
        // TODO : notify for the invalid token
      }
      if (data.errors) {
        console.log(account.name, `waiting for ${waitTimeSec} seconds...`);
        account.updateLastMessages([]);
        continue;
      }
      const que = data.data?.nextQuestionAnsweringAssignment?.question; // get fetched question
      // Same que found again
      if (que && que.id == account.lastQuestionId) {
        account.updateTimeToCheck(extraTime);
        console.log(account.name, `waiting for ${extraTime} seconds`);
        continue;
      }
      // If data have a question : send a message by the bot
      console.log(account.name, "Got a Question Updating data");
      account.updateLastQuestionId(que.id);
      account.updateTimeToCheck(extraTime);
      // try to accept the Question
      const response = await account.acceptQuestion();
      if (response.errors) {
        console.log(account.name, "Question already accepted");
      } else {
        // send new question message
        const lastMessages = sendQuestionMessage(
          client,
          que.body,
          account.name
        );
        account.updateLastMessages(lastMessages);
        console.log(account.name, "Question Sent");
      }
    } catch (error) {
      console.error("Some error occured in index.js ", error);
    }
  }
}

module.exports = handleNewQuestions;
