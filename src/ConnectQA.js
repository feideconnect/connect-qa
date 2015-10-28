
"use strict";


/**
 * ConnectQA is the main application that runs one or more test flows. 
 * Input can be used to dictate which test runs to execute..
 * (CLI Application) Try to run:  node index.js --help
 */

var util = require('util');
var optimist = require('optimist')
	.usage('Usage: $0 --set [string] ')
    .alias('h', 'help')
    .alias('s', 'set')
    .describe('set', 'Select configuration set, as specified in config.json')
    .describe('help', 'Show this help');

var argv = optimist.argv;

var Class = require('./Class').Class;
var OCEngine = require('./OCEngine/OCEngine').OCEngine;
var CodeFlow = require('./OCEngine/CodeFlow').CodeFlow;
var ConnectAPI = require('./APIEngine/ConnectAPI').ConnectAPI;
var extend = require('extend');



var fs = require('fs');

var ConnectQA = Class.extend({
	"init": function() {
		var allconfig = JSON.parse(fs.readFileSync('etc/config.json', 'utf8'));
		var sconfig = {};

		// console.log(argv);

		if (argv.help) {
			console.log(optimist.help());
			process.exit()

		}

		if (allconfig.common) {
			extend(sconfig, allconfig.common);
		}
		if (argv.set) {
			if (allconfig.sets[argv.set]) {
				extend(sconfig, allconfig.sets[argv.set], {"set": argv.set});
			} else {
				throw new Error("Could not find config for set [" + argv.set + "]")
			}
			
		} else if (allconfig.default && allconfig.sets[allconfig.default]) {
			extend(sconfig, allconfig.sets[allconfig.default], {"set": allconfig.default});
		}

		this.sconfig = sconfig;

		this.oce = new OCEngine(sconfig);
		this.codeflow = new CodeFlow(sconfig);


	},
	"run": function() {
		var that = this;

		return Promise.resolve()
			.then(function() {
				return that.oce.run();
			})
			.then(function() {
				return that.codeflow.run();
			})
			.then(function(token) {
				var api = new ConnectAPI(that.sconfig, token);
				return api.run();
			})
			.then(function() {
				console.log(" ---- done ----");
			});

	}
})

exports.ConnectQA = ConnectQA;


