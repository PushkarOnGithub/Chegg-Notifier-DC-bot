const { sendQuestionMessage } = require("./discordMessageUtils");

function parseAnswers(answers) {
  if (!answers?.data?.myAnswers?.edges) {
    return {};
  }
  try {
    let parsedAnswers = {};
    answers = answers.data.myAnswers.edges;
    for (let answer of answers) {
      const parsedAnswer = {
        questionBody: answer.node.question.body,
        qcReview: answer.node.qcReview,
        isDeleted: answer.node.question.isDeleted,
      };
      parsedAnswers[answer.node.question.id] = parsedAnswer;
    }
    return parsedAnswers;
  } catch (error) {
    console.error("Failed to parse answers:", error);
    return {};
  }
}

function compareAnswersAndNotify(oldAnswers, newAnswers, client, account) {
  console.log("Comparing answers for", account.name);

  for (let id in newAnswers) {
    if (
      oldAnswers[id] &&
      !oldAnswers[id].qcReview &&
      newAnswers[id]?.qcReview?.overallQcRating <= 3
    ) {
      console.log("QC Review mismatch for question", id);
      sendQuestionMessage(
        client,
        newAnswers[id].questionBody,
        `❌Red for ${account.name}❌`
      );
    } else if (
      oldAnswers[id] &&
      oldAnswers[id].isDeleted === false &&
      newAnswers[id].isDeleted === true
    ) {
      console.log("isDeleted mismatch for question", id);
      sendQuestionMessage(
        client,
        newAnswers[id].questionBody,
        `❌Deleted for ${account.name}❌`
      );
    }
  }
}

module.exports = { parseAnswers, compareAnswersAndNotify };
