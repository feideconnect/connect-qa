"use strict";

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
		console.log("opts", opts);
		return engine.get(opts[0].url);
	}
});
SelectProviderResponse.detect = function(response, body, c) {

	console.log("About to detect");
	console.log(response.statusCode);
	console.log(c("title").text());

	if (response.statusCode === 200 && c("title").text() === "Select your login provider") {
		return new SelectProviderResponse(response, body, c);
	}
	return null;
}


exports.SelectProviderResponse = SelectProviderResponse;