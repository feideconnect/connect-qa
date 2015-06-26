"use strict";

var Response = require('../Engine/Response').Response;

var RedirectResponse = Response.extend({
	"init": function(response, body, c) {
		this._super(response, body, c);
		this.type = "RedirectResponse";

		this.process();
	},
	"process": function() {
		this.url = this.response.headers.location;
	},
	"getURL": function() {
		return this.url;
	},
	"next": function(engine) {
		return engine.get(this.url);

	}
});

RedirectResponse.detect = function(response, body, c) {
	if (response.statusCode >= 301 && response.statusCode <= 303) {
		return new RedirectResponse(response, body, c);
	}
	return null;
}



exports.RedirectResponse = RedirectResponse;