"use strict";

var Logger = require('../Logger').Logger;
var Response = require('../Engine/Response').Response;

var SelectProviderResponse = Response.extend({
	"init": function(response, body, c) {
		this._super(response, body, c);
		this.type = "SelectProviderResponse";
	},
	"next": function(engine) {
		var that = this;
		var opts = [];
		this.$("div.list-group").each(function(i, item) {
			var t = that.$(this).find("h4.media-heading").text();
			var a = that.$(this).find("a").attr("href");
			opts.push({
				"url": a,
				"title": t
			});
		});

		this.assert.isAbove(opts.length, 0, "Provider listing must include more at least one provider option.");
		this.assert.equal(2, 3, "1 equals 1");
		// console.log("opts", opts);
		this.log.debug("Information from provider page", opts);

		return engine.get(opts[0].url);
	}
});
SelectProviderResponse.detect = function(response, body, c) {


	var log = Logger.get();

	// console.log("About to detect");
	// console.log(response.statusCode);
	// console.log(c("title").text());
	
	var responseMeta = {
		"head": response.statusCode + " " + response.statusMessage,
		"headers": response.headers
	};

	log.debug("About to SelectProviderResponse.detect() body", body, c("title").text());
	log.debug("About to SelectProviderResponse.detect() response", responseMeta);
	log.debug("About to SelectProviderResponse.detect() Page title is", c("title").text());

	if (response.statusCode === 200 && c("title").text() === "Select your login provider") {
		return new SelectProviderResponse(response, body, c);
	}
	return null;
}


exports.SelectProviderResponse = SelectProviderResponse;