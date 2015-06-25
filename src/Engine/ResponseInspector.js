
"use strict";

var request = require('request');
var cheerio = require('cheerio');

var Response = require('./Response').Response;
var Class = require('../Class').Class;


var ResponseInspector = Class.extend({
	"init": function() {
		this.responsetypes = [];
	},
	"add": function(rt) {
		// if (!(rt.prototype === Response)) {
		// 	console.log(rt);
		// 	throw new Error("Attempting to add a new response type that is not of the correct Response class");
		// }
		this.responsetypes.push(rt);
		return this;
	},
	"detect": function(response, body, c) {
		var pr;
		for(var i = 0; i < this.responsetypes.length; i++) {
			// console.log("ABOUT to detect", this.responsetypes[i]);
			pr = this.responsetypes[i].detect(response, body, c);

			if (pr !== null) {
				console.log(" Response: " + pr.type);
				return pr;
			}
		}
		throw new Error("Could not reckognize Response type");
	}
})

exports.ResponseInspector = ResponseInspector;
