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
		return engine.get({
			"url": this.url
		});
	},
	"debug": function() {
		this.log.debug("Juhuuuu", this.url);
		this._super();
	}
});

RedirectResponse.detect = function(response, body, c) {
	if (response.statusCode >= 301 && response.statusCode <= 303) {
		var rr = new RedirectResponse(response, body, c);
		console.log("RedirectResponse has url", rr.url);
		return rr;
	}
	return null;
}



exports.RedirectResponse = RedirectResponse;