const { getCollection, uploadCollection } = require("../firebase");
const { compareAnswersAndNotify, parseAnswers } = require("./answersUtils");
// const fs = require("fs");

async function handleAnswers(client, accounts) {
  const answersCollectionName = process.env.answersCollectionName || "answers";

  const oldAnswers = (await getCollection(answersCollectionName)).at(0);
  let newAnswers = {};
  for (let account of accounts) {
    const currAnswers = parseAnswers(await account.getAnswers());
    // const currAnswers = parseAnswers(JSON.parse(fs.readFileSync('./examples/answers.json', 'utf8')));

    compareAnswersAndNotify(oldAnswers, currAnswers, client, account);

    newAnswers = { ...newAnswers, ...currAnswers };
  }

  await uploadCollection(
    answersCollectionName,
    answersCollectionName,
    newAnswers
  );
}

// handleAnswers(null, [{name: 'test'}]);

module.exports = handleAnswers;
