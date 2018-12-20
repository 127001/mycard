#!/usr/bin/env node
// 👆 Used to tell Node.js that this is a CLI tool

// Pull in our modules
const chalk = require('chalk')
const boxen = require('boxen')
const request = require('request');

// Define options for Boxen
let options = {
  padding: 1,
  margin: 1,
  borderStyle: 'round'
};

let url = process.argv[2];

if (!url.startsWith('http://') && !url.startsWith('https://')) {
  url = `https://${url}`;
}

if (url.endsWith('/')) {
  url = url.slice(0, url.length - 1)
}

let cardUrl = url + '/card.json';

request.get({ url: cardUrl, json: true, timeout: 5000 }, function (err, resp, body) {
  let cardData = buildCardData(body, url);
  let output = buildOutput(cardData);
  console.log(output);
});

// Convert normal card.json data into chalk colors
function buildCardData(data, url) {
  let footerLabel = chalk.white.bold('Card');
  let footerContent = chalk.white(`npx mycard ${url}`);

  let cardData = {
    header: `${chalk.white(data.name)} / ${chalk.cyan(data.handle)}`,
    footer: `      ${footerLabel}: ${footerContent}`
  };

  if (data.items) {
    cardData.items = data.items.map((item) => {
      let label = chalk.white.bold(`${item.label}:`.padStart(11, ' '));
      let content = chalk.white(item.content);
      return `${label}  ${content}`;
    });
  }

  return cardData;
}

function buildOutput(lines) {
  let content = lines.header +
    '\n\n' +
    lines.items.join('\n') +
    '\n\n' +
    lines.footer;
  return chalk.green(boxen(content, options));
}
