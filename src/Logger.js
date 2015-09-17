"use strict";

var bunyan = require('bunyan');
var Class = require('./Class').Class;


var Logger = {
	"log": null,
	"init": function() {
		this.log = bunyan.createLogger({
			name: 'ConnectQA',
			stream: process.stdout,
			level: 'debug'
		});
	},
	"get": function() {
		if (this.log === null) {
			this.init();
		}
		return this.log;
	}
};

exports.Logger = Logger;