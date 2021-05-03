'use strict';
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');
//const MersenneTwister = require('mersennetwister');

// Stage Get request to retrieve data from either dad jokes or facts API
function pickRemote() {
	const getOptions = {
			hostname: 'inspirobot.me',
			path: '/api?generate=true',
			method: 'GET',
			headers: {
			  'User-Agent': 'Discord_Webhook/1.2 (https://github.com/sombraguerrero/DiscordWebhooks ;robert.setter@bobertdos.me)'
			}
		  };

	//Perform GET request with specified options.
	let imgData = '';
	https.request(getOptions, (addr_res) => {
		addr_res.on('data', (imgAddr) => { imgData += imgAddr; });
			addr_res.on('end', () => {
			
			var myImage = new Object();
			myImage.url = imgData;
			var myEmbed = new Object();
			myEmbed.image = myImage;
			myEmbed.title = "InspiroBot says...";
			myEmbed.color = 3368448; // Discord spec requires hexadecimal codes converted to a literal decimal value (#336600) 
			var myRoot = new Object();
			myRoot.embeds = new Array();
			myRoot.embeds.push(myEmbed);
			var embedString = JSON.stringify(myRoot);
			console.log(embedString);
			const discordOptions = {
				hostname: 'discord.com',
				path: '/api/webhooks/778858705197203467/{{dnd_token}}',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': Buffer.byteLength(embedString)
				}
			}
			const discordReq = https.request(discordOptions);
			discordReq.write(embedString);
			discordReq.end();
		});
	}).end();
}

function pickLocal(num) {
	// Navigate to and retrieve random file.
	var basePath = "/var/services/web/webhooks/inspirobot_local/";
	fs.readdir(basePath, (err, files) => {
		try {
			//files.sort();
			var selectedImg = files[Math.floor(num * files.length)];
			//Perform post to Discord
			var formData = new FormData();
			formData.append('content', 'InspiroBot once said...');
			formData.append('file', fs.createReadStream(basePath + selectedImg), { filename: selectedImg});
			formData.submit('https://discord.com/api/webhooks/778858705197203467/{{dnd_token}}', (err, res) => {
				var myLog = fs.createWriteStream('log.txt');
				myLog.write("Response code: " + res.statusCode + "\r\n" + err);
			});
		}
		catch(err) {
			var errLog = fs.createWriteStream('error.log');
			errLog.write(err.name + ": " + err.message + "\r\n");
		}
	});
}

pickRemote();
/***
var decision = MersenneTwister.random();
pickLocal(decision);
if (Math.floor(decision * 10) % 2 == 1) {
	pickLocal(decision);
}
else {
	pickRemote();
}
***/

