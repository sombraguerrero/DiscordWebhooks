'use strict';
const https = require('https');
const fs = require('fs');
const url = require('url');
function getKeyResponse(num) {
	fs.readFile('/var/services/web/webhooks/responses.csv', 'utf8', function(err, data) {
		var output = data.split('|');
		//console.log(output);
	
	var keyStone = new Object();
	keyStone.content = "<@540850957131579413> " + output[Math.floor(num * output.length)];
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

function NatalieDee(comicDate) {
	var myRoot = new Object();
	myRoot.content = "A comic for you, <@540850957131579413>\r\nhttp://nataliedee.com/" + comicDate;
	var embedString = JSON.stringify(myRoot);
	console.log(embedString);
	const discordOptions = {
		hostname: 'discord.com',
		path: '/api/webhooks/747963105241202800/{{pl_botspam}}',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(embedString)
		}
	}
	const discordReq = https.request(discordOptions);
	discordReq.write(embedString);
	discordReq.end();
}

function pullStuff(rockFact, target, targetpath) {
	const contentOptions = {
			hostname: target,
			path: targetpath,
			method: 'GET',
			headers: {
			  'Accept': 'text/plain',
			  'User-Agent': 'Discord_Webhook/1.2 (https://github.com/sombraguerrero/DiscordWebhooks ;robert.setter@bobertdos.me)'
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

function selectDate(num) {
	//Month is zero-indexed in JS!
	var startDate = new Date(2005,0,30);
	var endDate = new Date(2013,11,4);
	var opts = new Object();
	var modifier = endDate - startDate;
	var base_msec = startDate.getTime();
	var random_msec = base_msec + (num * modifier);
	opts.month = opts.day = opts.year = "2-digit";
	return new Date(random_msec).toLocaleDateString("en-US", opts).replace(/\//g, "");
}

var val = Math.random();
var decision = Math.floor(val * 16);
if (decision % 4 == 0) {
	//console.log('JOKE!!!');
	pullStuff(false, 'icanhazdadjoke.com', '');
}
else if (decision % 4 == 1) {
	//console.log('ROCK FACT!!!');
	pullStuff(true, 'uselessfacts.jsph.pl', '/random.txt?language=en');
}
else if (decision % 4 == 2) {
	//console.log('FORM RESPONSE!!!');
	getKeyResponse(val);
}
else {
	NatalieDee(selectDate(val));
}
