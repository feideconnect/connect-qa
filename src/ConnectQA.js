
"use strict";

var request = require('request');
var cheerio = require('cheerio');

var Class = require('./Class').Class;


var Response = Class.extend({
	"init": function(response, body, c) {
		this.response = response;
		this.body = body;
		this.$ = c; 
	}
});


var POSTResponse = Response.extend({
	"next": function(engine) {
		var obj = {};
		var that = this;
		// console.log("NEXT");

		// console.log(this.$("input"));

		var action = this.$("form").attr("action");

		this.$("input").each(function(i, item) {
			// console.log("item", this.$(item));
			if (that.$(this).attr("type") === "hidden") {
				// obj[item.attr("name")] = item.attr("value");
				// console.log("name", item.attribs.name);
				obj[that.$(item).attr("name")] = that.$(this).attr("value");
			}
		});

		var options = {
			"url": action,
			"method": "POST",
			"form": obj
		};

		console.log("Options", options);

		return engine.get(options);



		// console.log("OBJ", obj);
		// console.log("Action", action);
		// return obj;
	}
})


var RedirectResponse = Response.extend({
	"next": function(engine) {
		console.log("REDIRECT");
		console.log(this.response.headers);

		var url = this.response.headers.location;
		console.log("Moving to " + url);
		return engine.get(url);

	}
});



var SelectProviderResponse = Response.extend({
	"next": function(engine) {
		var that = this;
		var opts = [];
		this.$("div.list-group").each(function(i, item) {
			var t = that.$(this).find("h4.media-heading").text();
			var a = that.$(this).find("a").attr("href");
			opts.push({
				"url": a,
				"title": t
			});
		});
		console.log("opts", opts);
		return engine.get(opts[0].url);
	}
});




Response.inspect = function(response, body, c) {

	if (c("title").text() === "POST data") {
		return new POSTResponse(response, body, c);
	} else if (c("title").text() === "Redirect") {
		return new RedirectResponse(response, body, c);
	} else if (c("title").text() === "Select your login provider") {
		return new SelectProviderResponse(response, body, c);
	}




	console.log("BODUU IS -----"); console.log(body);
	throw new Error("Could not reckognize HTTP Response.");

}








var ConnectQA = function() {

	this.request = request.defaults({jar: true});

}


ConnectQA.prototype.get = function(url) {
	var that = this;

	console.log("----");
	console.log(url);

	return new Promise(function(resolve, reject) {
		that.request(url, function (error, response, body) {
			console.log("body");
			console.log(body);
			if (!error && response.statusCode === 200) {

				var $ = cheerio.load(body);
				var r = Response.inspect(response, body, $);
				resolve(r);

			} else if (!error && response.statusCode === 303) {

				var $ = cheerio.load(body);
				var r = Response.inspect(response, body, $);
				resolve(r);

			} else {
				console.log("Status", response.statusCode);
				reject(error);
			}
		});
	});

}

ConnectQA.prototype.run = function() {

	var that = this;
	this.get("https://auth.dev.feideconnect.no/oauth/authorization?response_type=token&state=bbdfd163-fe09-45de-b2b5-29b880d773c0&redirect_uri=https%3A%2F%2Fmin.dev.feideconnect.no%2FpassiveCallback.html&client_id=c148bc3f-6b15-47d7-ad23-3c36677eb8b5")
		.then(function(response) {


			if (response instanceof POSTResponse) {

				console.log("We got a POST Response");
				// console.log(response);
				return response.next(that);



			} else if (response instanceof SelectProviderResponse) {

				console.log("SELET PROVIDER");
				return response.next(that);


			} else {
				console.error("Uknown respone type");
			}


			// console.log("Juhu", response.response.statusMessage);
			// console.log("body");
			// // console.log(response.body);
			// console.log("----");
			// console.log(response.$("title").text());
			// console.log(response.getURL());
			




			// for(var key in response.response) {
			// 	console.log(" [ " + key + " ]" + typeof response.response[key] );
			// }

			// console.log(response.response);

		}).then(function(response) {

			console.log(" ----------- ----------- ----------- ----------- -----------");

			if (response instanceof POSTResponse) {

				console.log("BLA");
				// console.log(response);
				return response.next(that);

			} else if (response instanceof RedirectResponse) {

				console.log("We got a redirect");
				// console.log(response);
				return response.next(that);

			} else {
				console.error("Uknown respone type");
			}


		})
		.then(function(response) {
			console.log(" ----------- ----------- ----------- ----------- -----------");
			console.log(response);
		})
		.catch(function(error) {
			console.error("ERROR", error);
		});

}


exports.ConnectQA = ConnectQA;


