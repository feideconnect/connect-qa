
"use strict";

var request = require('request');
var tough = require('tough-cookie');

var cheerio = require('cheerio');
var extend = require('extend');

var stathat = require('stathat');

var Timer = require('../Timer').Timer;
var Class = require('../Class').Class;

var default_config = {};

var ConnectAPI = Class.extend({
	"init": function(config, token) {
		this.token = token;
		this.config = extend(true, default_config, config || {});

		this.jar = request.jar();
		this.request = request.defaults({"jar": this.jar});
	},

	"resetJar": function() {
		this.jar = request.jar();
	},


	"run": function() {
		var that = this;
		return Promise.resolve().then(function() {

			console.log("RUN API Thing.");

			return that.getJSON('groups', '/groups/me/groups', that.token, {"title": "my groups"})
				.then(function(data) {
					console.log("DATA", data);
					return data;
				});

		});
	},


	"getJSON": function(sys, path, token, to) {
		var that = this;
		// extend(opts, {"jar": this.jar});


		var url = this.config.ep[sys] + path;

		console.log("URL : " + url);
		console.log(this.token);

		var opts = {
			"url": url,
			"headers": {
				"Authorization": "Bearer " + token.access_token
			}
		};



		if (to) {
			var timer = new Timer();
		}

		// console.log("-------");
		// console.log(opts);

		return new Promise(function(resolve, reject) {
			that.request(opts, function (error, response, body) {

				if (error) {
					console.log("We have not yet defined interpretation of HTTP errors. TBD");
					return reject(error);
				}

				var data = JSON.parse(body);
				// var r = that.responseinspector.detect(response, body, $);


				if (to) {
					var dur = timer.dur();
					console.log("Duration [" + to.title + "] " + dur + " ms");
					if (that.config.stathat) {
						stathat.trackEZValue(that.config.stathat, that.config.set + " api " + to.title, dur, function() {
							console.log("Successfully stored timer to stathat [" + that.config.stathat + "] " + to.title + " " + dur);
						});
					}
				}

				resolve(data);

			});
		});
	},


});


exports.ConnectAPI = ConnectAPI;
