const https = require('https');

// Utility function to make API call to vapi.ai
const createAssistantAPI = (firstMessage, modelProvider, modelName, messages, knowledgeBaseUrl, endCallMessage, name, toolIds) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      "firstMessage": firstMessage || "",
      "model": {
        "provider": modelProvider || "openai",
        "model": modelName || "gpt-3.5-turbo",
        "messages": messages || [{ "role": "user", "content": "" }],
        // "knowledgeBase": {
        //   "server": {
        //     "url": knowledgeBaseUrl || ""
        //   }
        // }
        "toolIds": toolIds || [
          "e402a911-71a4-4879-90d6-92ec38b9d123"
        ]
      },
      "endCallMessage": endCallMessage || "",
      "name": name || "bb"
    });

    const options = {
      hostname: 'api.vapi.ai',
      path: '/assistant',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer e009eade-80be-4308-a5cb-ce7543eb6744', // Replace with your token
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const responseJson = JSON.parse(responseData);
          resolve(responseJson);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

const getAssistantFromVapi = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vapi.ai',
      path: `/assistant`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer e009eade-80be-4308-a5cb-ce7543eb6744', // Use your VAPI token
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const responseJson = JSON.parse(responseData);
          resolve(responseJson);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
};


module.exports = { createAssistantAPI, getAssistantFromVapi };