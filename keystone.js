'use strict';
const https = require('https');
const http = require('http');

// Stage Get request to retrieve data from either dad jokes or facts API
var decision = Math.floor(Math.random() * 10);
var target = "icanhazdadjoke.com";
var targetpath = "";
var rockFact = false;
if (decision % 2 == 1) {
	target = "uselessfacts.jsph.pl";
	targetpath = '/random.txt?language=en'
	rockFact = true;
}
const getOptions = {
        hostname: target,
        path: targetpath,
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
		  'User-Agent': 'Discord_Webhook/1.2 (https://github.com/sombraguerrero/RandomFanArt ;robert.setter@bobertdos.me)'
        }
      };

//Perform GET request with specified options.
https.get(getOptions, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

/****
  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
      `Status Code: ${statusCode}`);
  } else if (!/^text\/html/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // Consume response data to free up memory
    res.resume();
    return;
  }
  ***/

  // Stage POST request to Discord Webhook
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
		var postData = "{\"content\":\"<@540850957131579413> " + rawData + "\"}";
		if (rockFact) {
			var rockFactLines = rawData.split(/\r?\n/);
			postData = "{\"content\":\"<@540850957131579413> " + rockFactLines[0].slice(2).replace(/`/g, '\'') + "\"}";
		}
      const options = {
        hostname: 'discord.com',
        path: '/api/webhooks/747963105241202800/{{pl_botspam}}',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');

        res.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          console.log('No more data in response.');
        });
      });

      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      // Write data to request body
      req.write(postData);
      req.end();
      console.log(postData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
