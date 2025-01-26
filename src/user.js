class User {
  #apiUrl = "https://expert-gateway.chegg.com/nestor-graph/graphql";
  constructor(
    _name,
    _cookie,
    _lastQuestionId = 0,
    _timeToCheck = 0,
    _limit = 50,
    _lastMessages = []
  ) {
    this.name = _name;
    this.cookie = _cookie;
    this.lastQuestionId = _lastQuestionId;
    this.timeToCheck = _timeToCheck;
    this.limit = _limit;
    this.lastMessages = _lastMessages;
  }

  async fetchDataFromApi() {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        operationName: "NextQuestionAnsweringAssignment",
        variables: {},
        query:
          "query NextQuestionAnsweringAssignment {\n  nextQuestionAnsweringAssignment {\n    question {\n      body\n      id\n      uuid\n      subject {\n        id\n        name\n        subjectGroup {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      imageTranscriptionText\n      lastAnswerUuid\n      questionTemplate {\n        templateName\n        templateId\n        __typename\n      }\n      __typename\n    }\n    langTranslation {\n      body\n      translationLanguage\n      __typename\n    }\n    legacyAnswer {\n      id\n      body\n      isStructuredAnswer\n      structuredBody\n      template {\n        id\n        __typename\n      }\n      __typename\n    }\n    questionGeoLocation {\n      countryCode\n      countryName\n      languages\n      __typename\n    }\n    questionRoutingDetails {\n      answeringStartTime\n      bonusCount\n      bonusTimeAllocationEnabled\n      checkAnswerStructureEnabled\n      hasAnsweringStarted\n      questionAssignTime\n      questionSolvingProbability\n      routingType\n      allocationExperimentId\n      questionQualityFactor\n      routingTag\n      __typename\n    }\n    __typename\n  }\n}",
      }),
      headers: {
        "Content-Type": "application/json",
        "Apollographql-Client-Name": "chegg-web-producers",
        Authorization:
          "Basic alNNNG5iVHNXV0lHR2Y3OU1XVXJlQjA3YmpFeHJrRzM6SmQxbTVmd3o3aHRobnlCWg==",
        Cookie: this.cookie,
      },
    };
    try {
      const res = await fetch(this.#apiUrl, requestOptions);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async acceptQuestion() {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        operationName: "StartQuestionAnswering",
        variables: { questionId: this.lastQuestionId },
        query:
          "mutation StartQuestionAnswering($questionId: Long!) {\n  startQuestionAnswering(questionId: $questionId)\n}",
      }),
      headers: {
        "Content-Type": "application/json",
        "Apollographql-Client-Name": "chegg-web-producers",
        Authorization:
          "Basic alNNNG5iVHNXV0lHR2Y3OU1XVXJlQjA3YmpFeHJrRzM6SmQxbTVmd3o3aHRobnlCWg==",
        Cookie: this.cookie,
      },
    };
    try {
      const res = await fetch(this.#apiUrl, requestOptions);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async skipQuestion() {
    if (this.lastMessages.length === 0) {
      return false;
    }
    const reasons = [
      { primaryReason: "020", secondaryReason: "" },
      { primaryReason: "018", secondaryReason: "" },
      { primaryReason: "019", secondaryReason: "" },
    ]
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        operationName: "SkipQuestionAssignment",
        variables: {
          questionId: this.lastQuestionId,
          skipPageFlow: "ANSWERING",
          newSkipReason: reasons[Math.floor(Math.random() * reasons.length)],
        },
        query:
          "mutation SkipQuestionAssignment($questionId: Long!, $skipPageFlow: QnaCurrentPageFlow!, $skipPrimaryReason: QuestionSkipPrimaryReasons, $newSkipReason: QuestionNewSkipReasons) {\n  skipQuestionAssignment(\n    questionId: $questionId\n    skipPageFlow: $skipPageFlow\n    skipPrimaryReason: $skipPrimaryReason\n    newSkipReason: $newSkipReason\n  ) {\n    message\n    questionId\n    __typename\n  }\n}",
      }),
      headers: {
        "Content-Type": "application/json",
        "Apollographql-Client-Name": "chegg-web-producers",
        Authorization:
          "Basic alNNNG5iVHNXV0lHR2Y3OU1XVXJlQjA3YmpFeHJrRzM6SmQxbTVmd3o3aHRobnlCWg==",
        Cookie: this.cookie,
      },
    };
    try {
      const res = await fetch(this.#apiUrl, requestOptions);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async getLimit() {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        operationName: "ExpertAnsweringLimit",
        variables: {},
        query:
          "query ExpertAnsweringLimit {\n  expertAnsweringLimit {\n    currentLimit\n    previousLimit\n    __typename\n  }\n}",
      }),
      headers: {
        "Content-Type": "application/json",
        "Apollographql-Client-Name": "chegg-web-producers",
        Authorization:
          "Basic alNNNG5iVHNXV0lHR2Y3OU1XVXJlQjA3YmpFeHJrRzM6SmQxbTVmd3o3aHRobnlCWg==",
        Cookie: this.cookie,
      },
    };
    try {
      const res = await fetch(this.#apiUrl, requestOptions);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  async getAnswers() {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        operationName: "myAnswers",
        variables: {first: 0, last: 20, filters: {lookbackPeriod: "ALL", rating: "ALL"}},
        query:
          "query myAnswers($last: Int!, $first: Int!, $filters: AnswerFilters) {\n  myAnswers(last: $last, first: $first, filters: $filters) {\n    edges {\n      node {\n        answeredDate\n        id\n        uuid\n        isStructuredAnswer\n        isDeleted\n        question {\n          language\n          body\n          title\n          isDeleted\n          subject {\n            subjectGroup {\n              name\n              __typename\n            }\n            __typename\n          }\n          uuid\n          id\n          questionTemplate {\n            templateName\n            templateId\n            __typename\n          }\n          __typename\n        }\n        studentRating {\n          negative\n          positive\n          __typename\n        }\n        qcReview {\n          overallQcRating\n          isInvalid\n          isQcOfQcRating\n          reviewRubricVersion\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    totalResults\n    pageInfo {\n      startCursor\n      __typename\n    }\n    __typename\n  }\n}",
      }),
      headers: {
        "Content-Type": "application/json",
        "Apollographql-Client-Name": "chegg-web-producers",
        Authorization:
          "Basic alNNNG5iVHNXV0lHR2Y3OU1XVXJlQjA3YmpFeHJrRzM6SmQxbTVmd3o3aHRobnlCWg==",
        Cookie: this.cookie,
      },
    };
    try {
      const res = await fetch(this.#apiUrl, requestOptions);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  updateLimit(newLimit) {
    this.limit = newLimit;
  }
  updateLastQuestionId(newID) {
    this.lastQuestionId = newID;
  }
  updateTimeToCheck(newTime = 0) {
    this.timeToCheck = Math.floor(Date.now() / 1000) + newTime;
  }
  updateLastMessages(lastMessages) {
    this.lastMessages = lastMessages;
  }
  goodToCheck() {
    return this.timeToCheck >= Math.floor(Date.now() / 1000);
  }
}

module.exports = User;
