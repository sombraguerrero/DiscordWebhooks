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
var imgList = fs.readdirSync(basePath);
var selectedImg = imgList[Math.floor(num * imgList.length)];

//Perform post to Discord
var formData = new FormData();
formData.append('content', 'Random fan art: ' + selectedImg);
formData.append('file', fs.createReadStream(basePath + selectedImg), { filename: selectedImg});
formData.submit('https://discordapp.com/api/webhooks/768447672758566919/{{pl_wofbros}}', (err, res) => {
		var myLog = fs.createWriteStream('log.txt');
		myLog.write("Response code: " + res.statusCode + "\r\n" + err);
});
