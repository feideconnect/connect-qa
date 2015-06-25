
"use strict";

var Class = require('../Class').Class;

var Response = Class.extend({
	"init": function(response, body, c) {
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

