
"use strict";

var request = require('request');
var tough = require('tough-cookie');

var cheerio = require('cheerio');
var extend = require('extend');

var Timer = require('../Timer').Timer;

var Class = require('../Class').Class;
var ResponseInspector = require('./ResponseInspector').ResponseInspector;

var Logger = require('../Logger').Logger;






var Engine = Class.extend({
	"init": function() {
		
		this.log = Logger.get();

		this.responseinspector = new ResponseInspector(this.log);
		this.jar = request.jar();
		this.request = request.defaults({"jar": this.jar});

		this.timer = new Timer();
	},

	"resetJar": function() {
		this.jar = request.jar();
	},

	"done": function() {


		var that = this;


		console.log("Statistics ", this.title, this.timer.dur());

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

					that.log.error("getJSON() - We have not yet defined interpretation of HTTP errors", opts, to, error);
					return reject(error);
				}

				var data = JSON.parse(body);
				// var r = that.responseinspector.detect(response, body, $);


				if (to) {
					var dur = timer.dur();
					console.log("Duration [" + to.title + "] " + dur + " ms");
				}

				resolve(data);

			});
		});
	},


	"get": function (opts, to) {
		var that = this;
		// extend(opts, {"jar": this.jar});
		
		
		if (typeof opts === 'object') {
			opts.followRedirect = false;	
		}
		
		// console.log("About to get ", opts);

		// console.log("-------");
		// console.log(opts);
		// console.log(this.jar);

		return new Promise(function(resolve, reject) {
			that.request(opts, function (error, response, body) {

				if (error) {
					that.log.error("get() - We have not yet defined interpretation of HTTP errors", opts, to, error);
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
