const options = require('./accounts')[0].options;

const https = require('https');

function fetchDataFromApi(apiUrl, requestOptions) {
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

console.log("working");
const apiUrl = 'https://gateway.chegg.com/nestor-graph/graphql'; 

fetchDataFromApi(apiUrl, options)
.then(data => {
    console.log('Data fetched successfully:', data);
})
.catch(error => {
    console.error('Error fetching data:', error);
});