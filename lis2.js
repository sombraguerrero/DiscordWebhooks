'use strict';
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');

// Navigate to and retrieve random file.
var decision = Math.floor(Math.random() * 10);
var basePath = "/var/services/homes/bobertdos/Google_Drive/WD_lis-media/";
if (decision % 2 == 1) {
	basePath += "/le-louvre-de-lis2/"
}
var imgList = fs.readdirSync(basePath);
var selectedImg = imgList[Math.floor(Math.random() * imgList.length - 1)];

//Perform post to Discord
var formData = new FormData();
formData.append('content', 'Random fan art: ' + selectedImg);
formData.append('file', fs.createReadStream(basePath + selectedImg), { filename: selectedImg});
formData.submit('https://discordapp.com/api/webhooks/768447672758566919/{{pl_wolfbros}}', (err, res) => {
		var myLog = fs.createWriteStream('log.txt');
		myLog.write("Response code: " + res.statusCode + "\r\n" + err);
});
