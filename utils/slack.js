const axios = require('axios');
require('dotenv').config();

async function sendSlackMessage(message) {
    const token = process.env.SLACK_TOKEN;
    const channel = process.env.SLACK_CHANNEL

    if (!token) {
        console.error('Slack token is missing in environment variables.');
        return;
    }

    try {
      
        const response = await axios.post('https://slack.com/api/chat.postMessage', {
            channel,
            text: message
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to send Slack message:', error);
    }
}

module.exports = { sendSlackMessage };
