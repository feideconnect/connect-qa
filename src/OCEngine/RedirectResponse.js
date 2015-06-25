"use strict";

var Response = require('../Engine/Response').Response;

var RedirectResponse = Response.extend({
	"init": function(response, body, c) {
		this._super(response, body, c);
		this.type = "RedirectResponse";
	},
	"next": function(engine) {
		console.log("REDIRECT");
		console.log(this.response.headers);

		var url = this.response.headers.location;
		console.log("Moving to " + url);
		return engine.get(url);

	}
});

RedirectResponse.detect = function(response, body, c) {
	if (response.statusCode >= 301 && response.statusCode <= 303) {
		return new RedirectResponse(response, body, c);
	}
	return null;
}



exports.RedirectResponse = RedirectResponse;