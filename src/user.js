const https = require('https');
const apiUrl = 'https://gateway.chegg.com/nestor-graph/graphql'; 

class User{
    constructor(name, lastID, timeToCheck, cookie){
        this.name = name;
        this.lastID = lastID;
        this.timeToCheck = timeToCheck;
        this.cookie = cookie;
    }

    fetchDataFromApi() {
      const requestOptions={
        "method": "POST",
        "data":{
            operationName: 'NextQuestionAnsweringAssignment',
            variables: {},
            query: 'query NextQuestionAnsweringAssignment {\n  nextQuestionAnsweringAssignment {\n    question {\n      body\n      id\n      uuid\n      subject {\n        id\n        name\n        subjectGroup {\n          id\n          name\n          __typename\n        }\n        __typename\n      }\n      imageTranscriptionText\n      lastAnswerUuid\n      questionTemplate {\n        templateName\n        templateId\n        __typename\n      }\n      __typename\n    }\n    langTranslation {\n      body\n      translationLanguage\n      __typename\n    }\n    legacyAnswer {\n      id\n      body\n      isStructuredAnswer\n      structuredBody\n      template {\n        id\n        __typename\n      }\n      __typename\n    }\n    questionGeoLocation {\n      countryCode\n      countryName\n      languages\n      __typename\n    }\n    questionRoutingDetails {\n      answeringStartTime\n      bonusCount\n      bonusTimeAllocationEnabled\n      checkAnswerStructureEnabled\n      hasAnsweringStarted\n      questionAssignTime\n      questionSolvingProbability\n      routingType\n      allocationExperimentId\n      questionQualityFactor\n      routingTag\n      __typename\n    }\n    __typename\n  }\n}'
        },
        "headers": {
          "Content-Type": "application/json",
          "Apollographql-Client-Name": "chegg-web-producers",
          "Cookie": this.cookie
        }};
      return new Promise((resolve, reject) => {
        const req = https.request(apiUrl, requestOptions, (res) => {
          let data = '';
    
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(error);
            }
          });
        });
    
        req.on('error', (error) => {
          console.error('Error during request:', error);
          reject(error);
        });
        // If there is data to be sent in the request
        if (requestOptions.data) {
            req.write(JSON.stringify(requestOptions.data));
          }
        // End the request.
        req.end();
      });
    }
    acceptQuestion(){
      const requestOptions={
          "method": "POST",
          "data": {operationName:"StartQuestionAnswering",variables:{"questionId":this.lastID},query:"mutation StartQuestionAnswering($questionId: Long!) {\n  startQuestionAnswering(questionId: $questionId)\n}"},
          "headers": {
              "Content-Type": "application/json",
              "Apollographql-Client-Name": "chegg-web-producers",
              "Cookie": this.cookie
            }
      }
      return new Promise((resolve, reject) => {
        const req = https.request(apiUrl, requestOptions, (res) => {
          let data = '';
    
          res.on('data', (chunk) => {
            data += chunk;
          });
    
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(error);
            }
          });
        });
    
        req.on('error', (error) => {
          console.error('Error during request:', error);
          reject(error);
        });
        // If there is data to be sent in the request
        if (requestOptions.data) {
            req.write(JSON.stringify(requestOptions.data));
          }
        // End the request.
        req.end();
      });
    }
    skipQuestion() {
      if(this.timeToCheck < (Math.floor(Date.now()/1000))){
        return false;
      }
      const requestOptions={
        "method": "POST",
        "data": {operationName:"SkipQuestionAssignment",variables:{"questionId":this.lastID,"skipPageFlow":"ANSWERING","newSkipReason":{"primaryReason":"01","secondaryReason":""}},query:"mutation SkipQuestionAssignment($questionId: Long!, $skipPageFlow: QnaCurrentPageFlow!, $skipPrimaryReason: QuestionSkipPrimaryReasons, $newSkipReason: QuestionNewSkipReasons) {\n  skipQuestionAssignment(\n    questionId: $questionId\n    skipPageFlow: $skipPageFlow\n    skipPrimaryReason: $skipPrimaryReason\n    newSkipReason: $newSkipReason\n  ) {\n    message\n    questionId\n    __typename\n  }\n}"},
        "headers": {
            "Content-Type": "application/json",
            "Apollographql-Client-Name": "chegg-web-producers",
            "Cookie": this.cookie
          }
    };
    return new Promise((resolve, reject) => {
      const req = https.request(apiUrl, requestOptions, (res) => {
        let data = '';
  
        res.on('data', (chunk) => {
          data += chunk;
        });
  
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
            // console.log("skipped");
            console.log(data);
            return true;
          } catch (error) {
            reject(error);
            return false;
          }
        });
      });
  
      req.on('error', (error) => {
        console.error('Error during skipping:', error);
        reject(error);
        return false;
      });
      // If there is data to be sent in the request
      if (requestOptions.data) {
          req.write(JSON.stringify(requestOptions.data));
        }
      // End the request.
      req.end();
    });
    }
    updateLastID(newID){
      this.lastID = newID;
    }
    updateTimeToCheck(newTime){
      this.timeToCheck = newTime;
    }
}

module.exports = User;