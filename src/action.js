const fetch = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');
const randomPos = Math.round(Math.random() * 1000);

async function run() {
  const TENOR_TOKEN = core.getInput('TENOR_TOKEN');
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const octokit = github.getOctokit(GITHUB_TOKEN);

  const { context = {} } = github;
  const { pull_request } = context.payload;

  const url = `https://api.tenor.com/v1/search?q=thank%20you&pos=${randomPos}&limit=1&media_filter=minimal&contentfilter=high&key=${TENOR_TOKEN}`;
  const response = await fetch(url);
  const { results } = await response.json();
  const gifUrl = results[0].media[0].tinygif.url;

  console.log('Thank you for creating this PR!');

  await octokit.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body: `Thank you for submitting a pull request! We will try to review this as soon as we can.\n\n<img src="${gifUrl}" alt="thank you" />`
  });

}

run();