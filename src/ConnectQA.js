
"use strict";

var request = require('request');
var cheerio = require('cheerio');



var Response = function(response, body) {
	this.response = response;
	this.body = body;
	this.$ = cheerio.load(body);
}

Response.prototype.getURL = function() {
	return this.response.url;
}



var ConnectQA = function() {

	this.request = request.defaults({jar: true});

}


ConnectQA.prototype.get = function(url) {
	var that = this;
	return new Promise(function(resolve, reject) {
		that.request(url, function (error, response, body) {
			console.log("body");
			console.log(body);
			if (!error && response.statusCode === 200) {
				resolve(new Response(response, body));
			} else {
				reject(error);
			}
		});
	});

}

ConnectQA.prototype.run = function() {

	console.log("Run");

	this.get("https://auth.dev.feideconnect.no/oauth/authorization?response_type=token&state=bbdfd163-fe09-45de-b2b5-29b880d773c0&prompt=none&redirect_uri=https%3A%2F%2Fmin.dev.feideconnect.no%2FpassiveCallback.html&client_id=c148bc3f-6b15-47d7-ad23-3c36677eb8b5")
		.then(function(response) {

			console.log("Juhu", response.response.statusMessage);
			console.log("body");
			// console.log(response.body);
			console.log("----");
			console.log(response.$("title").text());
			console.log(response.getURL());
			console.log(response.response);

		}).catch(function(error) {
			console.error("ERROR", error);
		});

}


exports.ConnectQA = ConnectQA;


