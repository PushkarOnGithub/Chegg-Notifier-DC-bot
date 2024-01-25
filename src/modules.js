const https = require('https');
const sendMessage = (client, msg) => {
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send(msg);
}

const sendQuestionMessage = (client, msg) => {
    const channel = client.channels.cache.get(process.env.ChannelID);
    channel.send(msg);
}

const acceptQuestion = async (id) => {
    options = {
        "method": "POST",
        "data": {
            "operationName": "StartQuestionAnswering", "variables": { "questionId": id }, "query": "mutation StartQuestionAnswering($questionId: Long!) {\n  startQuestionAnswering(questionId: $questionId)\n}"
        },
        "headers": {
            "Content-Type": "application/json",
            "Apollographql-Client-Name": "chegg-web-producers",
        }
    }
    return new Promise((resolve, reject) => {
        const req = https.request('https://gateway.chegg.com/nestor-graph/graphql', options, (res) => {
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
        if (options.data) {
            req.write(JSON.stringify(options.data));
        }
        // End the request.
        req.end();
    });
}

module.exports = { "sendMessage": sendMessage, "sendQuestionMessage": sendQuestionMessage, "acceptQuestion": acceptQuestion };