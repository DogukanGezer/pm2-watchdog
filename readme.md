# Introduction
This script inspect your pm2 services and if any service given exit code, it send message to slack channel.


# Installation
1. locate to project file and install nodejs dependencies


```
npm install
```

3. After all u need apply module to pm2. Locate to project folder and run this code

```
SLACK_TOKEN=[token] SLACK_CHANNEL=[channel_id] pm2 install .
```

:warning:  Check slack channel for messages, but if messages  not came to slack channel check your slack_bot permission. You need "chat:write" permission.