'use strict';
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');

// Navigate to and retrieve random file.
var num = Math.random();
var basePath = "/var/services/homes/bobertdos/Google_Drive/WD_lis-media/";
if (Math.floor(num * 10) % 2 == 1) {
	basePath += "/le-louvre-de-lis2/"
}
fs.readdir(basePath, { withFileTypes: true }, (err, files) => {
	try {
		const filteredFiles = files
        .filter(dirent => dirent.isFile())
        .map(dirent => dirent.name);
		var selectedImg = filteredFiles[Math.floor(num * filteredFiles.length)];
		//Perform post to Discord
		var formData = new FormData();
		formData.append('content', 'Random fan art: ' + selectedImg);
		formData.append('file', fs.createReadStream(basePath + selectedImg), { filename: selectedImg});
		formData.submit('https://discordapp.com/api/webhooks/768447672758566919/{{wolfbros_token}}', (err, res) => {
				var myLog = fs.createWriteStream('log.txt');
				myLog.write("Response code: " + res.statusCode + "\r\n" + err);
		});
		//Question: Does the submit function fully dispose the object?
		//Answer: Yes
		var formData = new FormData();
		formData.append('content', 'Random fan art: ' + selectedImg);
		formData.append('file', fs.createReadStream(basePath + selectedImg), { filename: selectedImg});
		formData.submit('https://discord.com/api/webhooks/793530663922958336/{{wd_token}}', (err, res) => {
				var myLog = fs.createWriteStream('log_wd.txt');
				myLog.write("Response code: " + res.statusCode + "\r\n" + err);
		});
	}
	catch(err) {
		var errLog = fs.createWriteStream('error.log');
		errLog.write(err.name + ": " + err.message + "\r\n");
	}
});
