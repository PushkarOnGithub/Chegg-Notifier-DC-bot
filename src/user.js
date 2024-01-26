const https = require('https');
apiUrl = 'https://gateway.chegg.com/nestor-graph/graphql'; 

class User{
    constructor(name, options, lastData, timeToCheck){
        this.name = name;
        this.options = options;
        this.lastID = lastData;
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
    updateLastID(newID){
      this.lastID = newID;
    }
    updateTimeToCheck(newTime){
      this.timeToCheck = newTime;
    }
}

module.exports = User;