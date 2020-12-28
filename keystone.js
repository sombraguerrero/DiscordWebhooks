'use strict';
const https = require('https');

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
const contentOptions = {
        hostname: target,
        path: targetpath,
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
		  'User-Agent': 'Discord_Webhook/1.2 (https://github.com/sombraguerrero/RandomFanArt ;robert.setter@bobertdos.me)'
        }
      };

//Perform GET request with specified options. (Note that the aliased functions automatically call end() on the request object.)
const contentReq = https.request(contentOptions, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  // Stage POST request to Discord Webhook
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
		var postData = new Object();
		postData.content = "<@540850957131579413> " + rawData;
		if (rockFact) {
			var rockFactLines = rawData.split(/\r?\n/);
			postData.content = "<@540850957131579413> " + rockFactLines[0].slice(2).replace(/`/g, '\'');
		}
		var postString = JSON.stringify(postData);
      const discordOptions = {
        hostname: 'discord.com',
        path: '/api/webhooks/747963105241202800/{{pl_botspam}}',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postString)
        }
      };

      const discordReq = https.request(discordOptions, (res) => {
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

      discordReq.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });

      // Write data to request body
      discordReq.write(postString);
	  //Since the request method is being used here for the post, we're calling end() manually on both request objects.
      discordReq.end();
      console.log(postString);
    } catch (e) {
      console.error(e.message);
    }
  });
});

//Using request method for the get too, so calling end() here too.
contentReq.end();

contentReq.on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
