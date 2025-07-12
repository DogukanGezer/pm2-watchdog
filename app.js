require('dotenv').config();

var pmx = require('pmx');
var pm2 = require('pm2');

const { sendSlackMessage } = require("./utils/slack")
const { fetchLastCommits } = require("./utils/git")

let instances = [];
let counters = [];

pmx.initModule({

}, function (err, conf) {
  var spawn = require('child_process').spawn;

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
      const lastCommits = await fetchLastCommits();

      counters.push({
        name: instance.name,
        counter: setTimeout(() => {
          let serviceInstance = instances.find(x => x.name === instance.name);
          if (!serviceInstance) {
            console.error(`Service instance not found for name: ${instance.name}`);
            return;
          }

          const commitMessages = lastCommits.length ? `\n\nLast Commits:\n${lastCommits.join('\n')}\n` : '';
          if (serviceInstance.event === 'restart') {
           sendSlackMessage(`:rocket: :rocket: :rocket: :rocket: :rocket: :rocket:\`\`\`\nService:${serviceInstance.name}\nStatus:Deploying\nRestart Count:${serviceInstance.restart_time}\n${commitMessages}\`\`\`:rocket: :rocket: :rocket: :rocket: :rocket: :rocket:`);
          }
          if (serviceInstance.event === 'exit') {
            sendSlackMessage(`:fire: :fire: :fire: :fire: :fire: :fire:\`\`\`\nService:${serviceInstance.name}\nStatus:${serviceInstance.event}\nRestart Count:${serviceInstance.restart_time}\n${commitMessages}\`\`\`:fire: :fire: :fire: :fire: :fire: :fire:`);
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
