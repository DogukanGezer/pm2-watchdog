# Introduction
This script inspect your pm2 services and if any service given exit code, it send message to slack channel.


# Installation
1. locate to project file and install nodejs dependencies


```
npm install
```

2. Change example.env name as .env and set environment variables for slack integration

```
cp -r [source.env_location] [./detination/.env]
```

3. After all u need apply module to pm2. Locate to project folder and run this code

```
pm2 install .
```

:information_source:  Check slack channel for messages, but if messages  not came to slack channel check your slack_bot permission. Do you need "chat:write" permission.