const axios = require('axios');
require('dotenv').config();

const githubAxios = axios.create({
    baseURL: 'https://api.github.com/',
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        'User-Agent': 'pm2-watchdog'
    }
});

async function fetchLastCommits(commitCount = 5) {
    const repository = process.env.GITHUB_REPOSITORY;
    
    if (!repository) {
        console.error('Repository information is missing.');
        return [];
    }

    try {
        const response = await githubAxios.get(`/repos/${repository}/commits?per_page=${commitCount}`);
        return response.data.map(commit => {
            const shortSha = commit.sha.substring(0, 7);
            const message = commit.commit.message.split('\n')[0];
            const author = commit.commit.author.name;
            return `${shortSha} - ${message} (${author})`;
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('Repository not found. Please check the repository name and try again.');
        } else {
            console.error('Failed to fetch commits:', error);
        }
        return [];
    }
}

module.exports = { fetchLastCommits };
