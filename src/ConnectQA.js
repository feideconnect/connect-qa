
"use strict";

// var request = require('request');
// var cheerio = require('cheerio');

var Class = require('./Class').Class;
var OCEngine = require('./OCEngine/OCEngine').OCEngine;



var ConnectQA = Class.extend({
	"init": function() {
		this.oce = new OCEngine();
		
	},
	"run": function() {
		this.oce.run();
	}
})

exports.ConnectQA = ConnectQA;


