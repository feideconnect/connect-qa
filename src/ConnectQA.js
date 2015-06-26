
"use strict";

// var request = require('request');
// var cheerio = require('cheerio');

var Class = require('./Class').Class;
var OCEngine = require('./OCEngine/OCEngine').OCEngine;
var CodeFlow = require('./OCEngine/CodeFlow').CodeFlow;


var ConnectQA = Class.extend({
	"init": function() {
		this.oce = new OCEngine();
		this.codeflow = new CodeFlow();
		
	},
	"run": function() {
		this.oce.run();
		this.codeflow.run();
	}
})

exports.ConnectQA = ConnectQA;


