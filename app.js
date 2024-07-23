
var pmx = require('pmx');
var pm2 = require('pm2');
const axios = require('axios');
require('dotenv').config();

pmx.initModule({

}, function (err, conf) {
  var spawn = require('child_process').spawn;

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


  pm2.connect(async (err) => {
    if (err) {
      await pm2.disconnect()
    }

    pm2.launchBus((err, bus) => {
      bus.on('process:event', async (data) => {
        if (!data) { return; }
        if (data.process.cron_restart) { return; }
        if (data.event == 'exit') {
          await publishSlackMessage(
            process.env.SLACK_CHANNEL,
            `:fire: :fire: :fire: :fire: :fire: :fire:\`\`\`\nService:${data.process.name}\nStatus:${data.event}\nRestart Count:${data.process.restart_time}\n\`\`\`:fire: :fire: :fire: :fire: :fire: :fire:`
          )
        }
      })
    })
  })


  pmx.scopedAction('lsof cmd', function (options, res) {
    var child = spawn('lsof', []);

    child.stdout.on('data', function (chunk) {
      chunk.toString().split('\n').forEach(function (line) {
        /**
         * Here we send logs attached to this command
         */
        res.send(line);
      });
    });

    child.stdout.on('end', function (chunk) {
      /**
       * Then we emit end to finalize the function
       */
      res.end('end');
    });

  });


});
