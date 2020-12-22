'use strict';
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');


// Stage Get request to retrieve data from either dad jokes or facts API

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
https.get(getOptions, (addr_res) => {
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
});