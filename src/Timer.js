"use strict";

var Class = require('./Class').Class;

var Timer = Class.extend({
	"init": function() {
		this.start = new Date();
	},
	"dur": function() {
		var now = new Date();
		return now.getTime() - this.start.getTime();
	}

});

exports.Timer = Timer;
