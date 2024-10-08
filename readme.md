# Mongo Sentinel

## Introduction 🚀

The PM2 Watchdog is a monitoring module designed to track the status of your PM2 processes and detect important changes such as restarts or unintentional exits. By integrating with Slack, it automatically sends detailed notifications to a specified channel when a process is deployed or unexpectedly terminated.

* **Monitors PM2 process events**: Tracks process restarts and exits.
* **Slack Integration**: Sends notifications with important process details directly to a Slack channel. 📩
* **Deploy Detection**: Differentiates between intentional restarts (deployments) and unintentional exits (crashes). 🛠️

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white) ![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white) ![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white) ![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)
---

## Prerequisites 📋

* Node.js 19 or later 🟢
* PM2 installed globally (`npm install pm2 -g`) ⚙️
* Slack API Token and Channel ID 🔑

## Installation 🛠️

#### Step 1: Clone the repository (if applicable) or copy the codebase to your local environment.

```
git clone git@github.com:DogukanGezer/pm2-watchdog.git

or

git clone https://github.com/DogukanGezer/pm2-watchdog.git
```

#### Step 2: Install Dependencies
Navigate to the project directory and install the dependencies:

```
cd pm2-watchdog
npm install
```

#### Step 3: Configure Environment
Create a `.env` file in the root directory and add your Slack token and channel ID:

```
SLACK_TOKEN="your_slack_token"
SLACK_CHANNEL="your_slack_channel_id"
```

#### Step 4: Deploy the Module
To deploy and run the module, use the following PM2 command:

```
pm2 install ./
```

This command installs and starts the PM2 Watchdog module.


## Environment Variables 🌐

| Variable       | Description                       | Example Value          |
|----------------|-----------------------------------|------------------------|
| `SLACK_TOKEN`  | Your Slack Bot User OAuth Token   | `xoxb-your-slack-token` |
| `SLACK_CHANNEL`| The ID of the Slack channel       | `your-channel-id`            |

---

## Usage 🚀

The module automatically monitors PM2 events and sends messages to your specified Slack channel when a service:

* Exits unexpectedly (unintentional shutdown).
* Restarts (intentional or as part of a deployment).

You will receive messages with details such as the service name, status, and restart count.

## Example Slack Messages 📧

#### Deployment (Restart):

```
🚀 🚀 🚀 🚀 🚀 🚀
Service: your-service-name
Status: Deploying
Restart Count: 2
🚀 🚀 🚀 🚀 🚀 🚀
```

#### Unintentional Exit:

```
🔥 🔥 🔥 🔥 🔥 🔥
Service: your-service-name
Status: exit
Restart Count: 5
🔥 🔥 🔥 🔥 🔥 🔥
```

---

## License 📜
This project is licensed under the MIT License.

---

# Conclusion 🎉
The PM2 Watchdog module is now installed and actively monitoring your processes. Any significant events like restarts or exits will trigger notifications to your specified Slack channel, ensuring you’re always aware of the status of your services.

## 🌟 Stargazers

Show your support by giving us a star on GitHub! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=DogukanGezer/mongo-sentinel&type=Date)](https://star-history.com/#DogukanGezer/mongo-sentinel&Date)

