const fetch = require('node-fetch');
const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
  const TENOR_TOKEN = core.getInput('TENOR_TOKEN');
  const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
  const { context = {} } = github;
  const octokit = github.getOctokit(GITHUB_TOKEN);

  const { pull_request } = context.payload;

  const url = `https://tenor.googleapis.com/v2/search?q=thank%20you&limit=50&media_filter=minimal&contentfilter=high&key=${TENOR_TOKEN}`
  const response = await fetch(url);
  const { results } = await response.json();
  const gifUrl = results[Math.floor(Math.random()*results.length)].media_formats.tinygif.url;

  console.log('Thank you for creating this PR!');

  await octokit.rest.issues.createComment({
    ...context.repo,
    issue_number: pull_request.number,
    body: `Thank you for submitting a pull request! We will try to review this as soon as we can.\n\n<img src="${gifUrl}" alt="thank you" />`
  });

}

run();