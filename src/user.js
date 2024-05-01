const https = require('https');
apiUrl = 'https://gateway.chegg.com/nestor-graph/graphql'; 

class User{
    constructor(name, options, lastID, timeToCheck){
        this.name = name;
        this.options = options;
        this.lastID = lastID;
        this.timeToCheck = timeToCheck;
    }

    fetchDataFromApi() {
      const requestOptions=this.options;
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
              "Cookie": this.options.headers.Cookie
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
            "Cookie": this.options.headers.Cookie
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
            console.log("skipped");
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