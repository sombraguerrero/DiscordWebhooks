'use strict';
const https = require('https');
const fs = require('fs');
function getKeyResponse(num) {
	fs.readFile('/var/services/web/webhooks/responses.csv', 'utf8', function(err, data) {
		var output = data.split('|');
		//console.log(output);
	
	var keyStone = new Object();
	keyStone.content = "<@user> " + output[Math.floor(num * output.length)];
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
	myRoot.content = "A comic for you, <@user>\r\nhttp://nataliedee.com/" + comicDate;
	var postString = JSON.stringify(myRoot);
	console.log(postString);
	const discordOptions = {
		hostname: 'discord.com',
		path: '/api/webhooks/747963105241202800/{{pl_botspam}}',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postString)
		}
	}
	const discordReq = https.request(discordOptions);
	discordReq.write(postString);
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

function selectDate(num, isNat) {
	//Month is zero-indexed in JS!
	var startDate = null;
	var endDate = null;
	
	var modifier = 0;
	var base_msec = 0;
	var random_msec = base_msec + (num * modifier);
	var finalDate = null;
	if (isNat)
	{
		startDate = new Date(2005,0,30);
		endDate = new Date(2013,11,4);
		base_msec = startDate.getTime();
		modifier = endDate - startDate;
		random_msec = base_msec + Math.floor(modifier * num);
		var opts = new Object();
		opts.month = opts.day = opts.year = "2-digit";
		finalDate = new Date(random_msec).toLocaleDateString("en-US", opts).replace(/\//g, ''); // RegEx is wrapped in /.../ so \ is needed to escape the target /; (g)lobal modifier
	}
	else
	{
		startDate = new Date(1995,5,17); //per NASA spec, must be after 1995-06-16, the first day APOD was posted
		endDate = new Date();
		base_msec = startDate.getTime();
		modifier = endDate - startDate;
		random_msec = base_msec + Math.floor(modifier * num);
		finalDate =  new Date(random_msec).toISOString().slice(0,10);
	}
	return finalDate;
}

function JeopardyQ() {
	const contentOptions = {
			hostname: 'jservice.io',
			path: '/api/random',
			method: 'GET',
			headers: {
			  'Accept': 'application/json',
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
			var parsedData = JSON.parse(rawData);
			console.log("My Content\r\n" + parsedData);
			var postData = new Object();
			postData.content = "<@user>\r\n**TRIVIA** (originally from Jeopardy)\r\nQ: " + parsedData[0].question + '\r\n\r\nA: ||' + parsedData[0].answer + '||';
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
			  console.log('No more data in response.' + "\r\nThis is for Jeopardy.");
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

function TronaldDump() {
	const contentOptions = {
			hostname: 'tronalddump.io',
			path: '/random/quote',
			method: 'GET',
			headers: {
			  'Accept': 'application/json',
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
			var parsedData = JSON.parse(rawData);
			console.log("My Content\r\n" + parsedData);
			var postData = new Object();
			postData.content = "<@user> Trump allegedly once said...\r\n" + parsedData.value;
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
			  console.log('No more data in response.' + "\r\nThis is for Tronald Dump.");
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

function KanyeRest() {
	const contentOptions = {
			hostname: 'api.kanye.rest',
			method: 'GET',
			headers: {
			  'Accept': 'application/json',
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
			var parsedData = JSON.parse(rawData);
			console.log("My Content\r\n" + parsedData);
			var postData = new Object();
			postData.content = "<@user> Kanye allegedly once said...\r\n" + parsedData.quote;
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
			  console.log('No more data in response.' + "\r\nThis is for Kanye Rest.");
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

function NasaAPOD(apodDate) {
	const contentOptions = {
			hostname: 'api.nasa.gov',
			path: '/planetary/apod?date=' + apodDate + '&api_key={{apod}}',
			method: 'GET',
			headers: {
			  'Accept': 'application/json',
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
			var parsedData = JSON.parse(rawData);
			console.log("My Content\r\n" + parsedData);
			var myImage = new Object();
			myImage.url = parsedData.url;
			var myProvider = new Object();
			myProvider.name = 'NASA';
			myProvider.url = 'https://api.nasa.gov/';
			var myAuthor = new Object();
			myAuthor.name = parsedData.copyright;
			var myFooter = new Object();
			myFooter.text = 'By: ' + parsedData.copyright + '\r\nPosted: ' + parsedData.date;
			var myEmbed = new Object();
			myEmbed.image = myImage;
			myEmbed.author = myAuthor;
			myEmbed.provider = myProvider;
			myEmbed.footer = myFooter;
			myEmbed.title = parsedData.title;
			myEmbed.description = parsedData.explanation;
			var myRoot = new Object();
			myRoot.content = '<@user>\r\n';
			myRoot.embeds = new Array();
			myRoot.embeds.push(myEmbed);
			var embedString = JSON.stringify(myRoot);
		  const discordOptions = {
			hostname: 'discord.com',
			path: '/api/webhooks/747963105241202800/{{pl_botspam}}',
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Content-Length': Buffer.byteLength(embedString)
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
			  console.log('No more data in response.' + "\r\nThis is for the NASA APOD");
			});
		  });

		  discordReq.on('error', (e) => {
			console.error(`problem with request: ${e.message}`);
		  });

		  // Write data to request body
		  discordReq.write(embedString);
		  //Since the request method is being used here for the post, we're calling end() manually on both request objects.
		  discordReq.end();
		  console.log(embedString);
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

var val = Math.random();
var debugVal = 3;
switch (Math.floor(val * 8)) {
//switch (debugVal) {
	case 0:
	//console.log('JOKE!!!');
	pullStuff(false, 'icanhazdadjoke.com', '');
	break;
	
	case 1:
	//console.log('ROCK FACT!!!');
	pullStuff(true, 'uselessfacts.jsph.pl', '/random.txt?language=en');
	break;
	
	case 2:
	//console.log('FORM RESPONSE!!!');
	getKeyResponse(val);
	break;
	
	case 3:
	NasaAPOD(selectDate(val, false));
	break;
	
	case 4:
	JeopardyQ();
	break;
	
	case 5:
	TronaldDump();
	break;
	
	case 6:
	KanyeRest();
	break;
	
	default:
	NatalieDee(selectDate(val, true));
	break;
}
