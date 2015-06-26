"use strict";


var Class = require('../Class').Class;

var AccessToken = Class.extend({
	"init": function(props) {
		for(var key in props) {
			this[key] = props[key];
		}
	}
})

exports.AccessToken = AccessToken;


