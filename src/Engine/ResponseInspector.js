
"use strict";

var request = require('request');
var cheerio = require('cheerio');

var Response = require('./Response').Response;
var Class = require('../Class').Class;

/**
 * The ResponseInspector inspects an HTTP Response.
 * Each ResponseType inculdes a detection test that evaluates if this HTTP response is of that kind.
 *
 */


var ResponseInspector = Class.extend({
	"init": function(log) {
		this.log = log;
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

		// console.log(Object.keys(response.req))


		for(var i = 0; i < this.responsetypes.length; i++) {
			// console.log("ABOUT to detect", this.responsetypes[i]);
			pr = this.responsetypes[i].detect(response, body, c);

			if (pr !== null) {
				this.log.info("Response detected as ", pr.type);
				return pr;
			}
		}
		// console.log("Data is ", body);
		// console.log("Data is ", response);
		// console.log("Data is ", c);
		this.log.error("Could not reckognize Response type", {
				"body": body,
				"responseHeaders": response.headers,
				"requestHeaders": response.req._headers,
			 "path": response.req.path
			})
		throw new Error("Could not reckognize Response type");
	}
})

exports.ResponseInspector = ResponseInspector;
