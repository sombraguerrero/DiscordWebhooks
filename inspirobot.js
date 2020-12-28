'use strict';
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');


// Stage Get request to retrieve data from either dad jokes or facts API
function pickRemote() {
	const getOptions = {
			hostname: 'inspirobot.me',
			path: '/api?generate=true',
			method: 'GET',
			headers: {
			  'User-Agent': 'Discord_Webhook/1.2 (https://github.com/sombraguerrero/RandomFanArt ;robert.setter@bobertdos.me)'
			}
		  };

	//Perform GET request with specified options.
	let imgData = '';
	var formData = new FormData();
	https.request(getOptions, (addr_res) => {
		addr_res.on('data', (imgAddr) => { imgData += imgAddr; });
		addr_res.on('end', () => {
				https.get(imgData, (imgResp) => {
				var imgOut = fs.createWriteStream('InspiroBot.jpg');
				imgResp.pipe(imgOut);
				imgOut.on('finish', () => {
					formData.append('content', 'InspiroBot says...');
					formData.append('file', fs.createReadStream('InspiroBot.jpg'), {filename: 'InspiroBot.jpg'});
					formData.submit('https://discord.com/api/webhooks/778858705197203467/{{dnd_token}}');
				});
			});
		});
	}).end();
}

function pickLocal(num) {
	// Navigate to and retrieve random file.
	var basePath = "/var/services/web/webhooks/inspirobot_local/";
	var imgList = fs.readdirSync(basePath);
	var selectedImg = imgList[Math.floor(num * imgList.length)];

	//Perform post to Discord
	var formData = new FormData();
	formData.append('content', 'InspiroBot once said...');
	formData.append('file', fs.createReadStream(basePath + selectedImg), { filename: selectedImg});
	formData.submit('https://discord.com/api/webhooks/778858705197203467/{{dnd_token}}', (err, res) => {
			var myLog = fs.createWriteStream('log.txt');
			myLog.write("Response code: " + res.statusCode + "\r\n" + err);
	});
}

var decision = Math.random();
if (Math.floor(decision * 10) % 2 == 1) {
	pickLocal(decision);
}
else {
	pickRemote();
}
