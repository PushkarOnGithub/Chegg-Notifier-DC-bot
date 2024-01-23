const cookies = require('./cookies');

const accounts = [];

for(let i = 0;i<cookies.length;i++){
  const cookie = cookies[i];
  let account = {
    name: cookie.name,
    options:{
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
      }}
  }
  accounts.push(account);
}

module.exports = accounts;