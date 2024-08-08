
var pmx = require('pmx');
var pm2 = require('pm2');
const axios = require('axios');
require('dotenv').config();

pmx.initModule({

}, function (err, conf) {
  var spawn = require('child_process').spawn;

  let instances = [];
  let counters = [];

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

  async function appendInstance(instance) {
    let index = instances.findIndex(x => x.name === instance.name && x.pm_id === instance.pm_id);
    let counterIndex = counters.findIndex(x => x.name === instance.name);

    if (index === -1) {
      instances.push(instance);
    }
    else {
      instances[index] = instance;
    }

    if (counterIndex === -1) {
      counters.push({
        name: instance.name,
        counter: setTimeout(() => {
          let serviceInstance = instances.find(x => x.name === instance.name);
          if (serviceInstance.event == 'restart') {
            publishSlackMessage(
              process.env.SLACK_CHANNEL,
              `:rocket: :rocket: :rocket: :rocket: :rocket: :rocket:\`\`\`\nService:${serviceInstance.name}\nStatus:Deploying\nRestart Count:${serviceInstance.restart_time}\n\`\`\`:rocket: :rocket: :rocket: :rocket: :rocket: :rocket:`
            )
          }
          if (serviceInstance.event == 'exit') {
            publishSlackMessage(
              process.env.SLACK_CHANNEL,
              `:fire: :fire: :fire: :fire: :fire: :fire:\`\`\`\nService:${serviceInstance.name}\nStatus:${serviceInstance.event}\nRestart Count:${serviceInstance.restart_time}\n\`\`\`:fire: :fire: :fire: :fire: :fire: :fire:`
            )
          }

          clearTimeout(counters.find(x => x.name === serviceInstance.name).counter);
          counters = counters.filter(x => x.name !== serviceInstance.name);
          instances = instances.filter(x => x.name !== serviceInstance.name);
        }, 5000)
      });
    }
  }

  pm2.connect(async (err) => {
    if (err) {
      await pm2.disconnect()
    }

    pm2.launchBus((err, bus) => {
      bus.on('process:event', async (data) => {
        if (!data) { return; }
        if (data.event == 'online') { return; }
        if (data.process.cron_restart) { return; }
        if (data.event == 'exit' || data.event == 'restart') {
          await appendInstance({
            name: data.process.name,
            pm_id: data.process.pm_id,
            unstable_restarts: data.process.unstable_restarts,
            restart_time: data.process.restart_time,
            exit_code: data.process.exit_code,
            event: data.event
          })
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
