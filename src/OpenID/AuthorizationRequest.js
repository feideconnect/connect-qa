"use strict";


var Class = require('../Class').Class;

var AuthorizationRequest = Class.extend({
	"init": function(props) {
		for(var key in props) {
			this[key] = props[key];
		}
	}
})

exports.AuthorizationRequest = AuthorizationRequest;


