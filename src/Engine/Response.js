
"use strict";

var Logger = require('../Logger').Logger;
var Class = require('../Class').Class;
var chai = require('chai');

var Response = Class.extend({
	"init": function(response, body, c) {

		this.log = Logger.get();
		this.assert = chai.assert;

		this.response = response;
		this.body = body;
		this.$ = c; 

		this.type = "Response";
	},
	"debug": function() {

		console.log(" - - - - - - - - - - - - - - - - -  Body [" + this.type + "] - - - - - - - - -- - - - - - - - -");
		console.log(this.body);
		console.log(" - - - - -- - - - -- - - - -- - - - -- - - - -- - - - -- - - - -- - - - -- - - - -  /Body - - - - -- - - - -- - - - -- - - - -");

	}
});


exports.Response = Response;

