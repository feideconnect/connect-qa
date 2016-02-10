
"use strict";

var chai = require('chai');
var tmp = require('tmp');
var fs = require('fs');
var readlineSync = require('readline-sync');
var open = require("open");

var Logger = require('../Logger').Logger;
var Class = require('../Class').Class;


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
        var that = this;

        that.log.info("Debugging [" + this.type + "]");

        console.log(" - - - - - - - - - - - - - - - - -  Body [" + this.type + "] - - - - - - - - -- - - - - - - - -");
        console.log(this.body);
        console.log(" - - - - -- - - - -- - - - -- - - - -- - - - -- - - - -- - - - -- - - - -- - - - -  /Body - - - - -- - - - -- - - - -- - - - -");



        var tmpobj = tmp.fileSync({prefix: 'connectqa-', postfix: '.html', keep: true });

        fs.writeFileSync(tmpobj.name, this.body);
        that.log.info('open -a Google\\ Chrome  ' + tmpobj.name);
        open(tmpobj.name, 'Google Chrome');



        // that.log.info("Hit [enter] to continue");
        // var x = readlineSync.question('Hit [enter] to continue.');

    }
});


exports.Response = Response;

