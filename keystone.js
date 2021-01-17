'use strict';
const https = require('https');
const fs = require('fs');
function getKeyResponse() {
	fs.readFile('/var/services/web/webhooks/responses.csv', 'utf8', function(err, data) {
		var output = data.split('|');
		//console.log(output);
	
	var keyStone = new Object();
	keyStone.content = "<@user> " + output[Math.floor(Math.random() * output.length)];
	var postString = JSON.stringify(keyStone);
	try {
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
		}
		catch (e) {
		  console.error(e.message);
		}
	});
}

function pullStuff(rockFact, target, targetpath) {
	const contentOptions = {
			hostname: target,
			path: targetpath,
			method: 'GET',
			headers: {
			  'Accept': 'text/plain',
			  'User-Agent': 'Discord_Webhook/1.2 (https://github.com/sombraguerrero/RandomFanArt ;robert.setter@bobertdos.me)'
			}
		  };
		  //console.log(contentOptions);

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
			postData.content = "<@user> " + rawData;
			if (rockFact) {
				var rockFactLines = rawData.split(/\r?\n/);
				postData.content = "<@user> " + rockFactLines[0].slice(2).replace(/`/g, '\'');
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
			  console.log('No more data in response.' + "\r\nThis is for " + target);
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
}

var decision = Math.floor(Math.random() * 12);
if (decision % 3 == 0) {
	//console.log('JOKE!!!');
	pullStuff(false, 'icanhazdadjoke.com', '');
}
else if (decision % 3 == 1) {
	//console.log('ROCK FACT!!!');
	pullStuff(true, 'uselessfacts.jsph.pl', '/random.txt?language=en');
}
else {
	//console.log('FORM RESPONSE!!!');
	getKeyResponse();
}
