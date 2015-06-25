
"use strict";

var request = require('request');
var cheerio = require('cheerio');

var Class = require('../Class').Class;
var ResponseInspector = require('./ResponseInspector').ResponseInspector;


var Engine = Class.extend({
	"init": function() {
		this.responseinspector = new ResponseInspector();
		this.request = request.defaults({jar: true});
	},
	"get": function (url) {
		var that = this;

		// console.log("----");
		// console.log(url);

		return new Promise(function(resolve, reject) {
			that.request(url, function (error, response, body) {

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
		console.log("---- running engine");
	}
});


exports.Engine = Engine;
