
"use strict";

var request = require('request');
var tough = require('tough-cookie');

var cheerio = require('cheerio');
var extend = require('extend');

var stathat = require('stathat');

var Timer = require('../Timer').Timer;

var Class = require('../Class').Class;
var ResponseInspector = require('./ResponseInspector').ResponseInspector;




var Engine = Class.extend({
	"init": function() {
		this.responseinspector = new ResponseInspector();
		this.jar = request.jar();
		this.request = request.defaults({"jar": this.jar});

		this.timer = new Timer();
	},

	"resetJar": function() {
		this.jar = request.jar();
	},

	"done": function() {
		var email = "andreas@solweb.no";
		var that = this;

		if (!this.config.stathat) {
			console.log("No statistics");
		}

		stathat.trackEZValue(this.config.stathat, this.config.set + " flow " + this.title, this.timer.dur(), function() {
			console.log("Successfully stored timer to stathat [" + email + "] " + that.title + " " + that.timer.dur());
		});
	},


	"getJSON": function(opts, to) {
		var that = this;
		// extend(opts, {"jar": this.jar});


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
						stathat.trackEZValue(that.config.stathat, that.config.set + " " + to.title, dur, function() {
							console.log("Successfully stored timer to stathat [" + that.config.stathat + "] " + to.title + " " + dur);
						});
					}
				}


				resolve(data);

			});
		});
	},


	"get": function (opts, to) {
		var that = this;
		// extend(opts, {"jar": this.jar});



		// console.log("-------");
		// console.log(opts);
		// console.log(this.jar);

		return new Promise(function(resolve, reject) {
			that.request(opts, function (error, response, body) {

				if (error) {
					console.log("We have not yet defined interpretation of HTTP errors. TBD");
					return reject(error);
				}

				var $ = cheerio.load(body);
				var r = that.responseinspector.detect(response, body, $);




				resolve(r);

			});
		});
	},
	"run": function() {

	}
});


exports.Engine = Engine;
