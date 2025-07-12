const axios = require('axios');
require('dotenv').config();

async function publishSlackMessage(channel, msg) {
  let token = process.env.SLACK_TOKEN;

  try {
    const response = await axios.post('https://slack.com/api/chat.postMessage', {
      channel: channel,
      text: msg
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  } catch (error) {
    console.log(error);
  }
}

module.exports = publishSlackMessage;
