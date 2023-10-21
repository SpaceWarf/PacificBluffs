const functions = require('firebase-functions');
const axios = require('axios');
const cors = require('cors')({ origin: true });

exports.triggerDiscordWebhook = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    axios.post(
      request.body.data.url,
      {
        content: request.body.data.content,
        embeds: request.body.data.embeds
      }
    );
    response.status(200).json({ result: 'Function Invoked Successfully.' });
  });
});