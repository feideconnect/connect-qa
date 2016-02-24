"use strict";

var Response = require('../Engine/Response').Response;



var POSTResponse = Response.extend({
	"init": function(response, body, c) {
		this._super(response, body, c);
		this.type = "POSTResponse";
	},
	"next": function(engine) {
		var obj = {};
		var that = this;

		// console.log("NEXT");
		// console.log(this.$("input"));

		var action = this.$("form").attr("action");

		this.$("input").each(function(i, item) {
			// console.log("item", this.$(item));
			if (that.$(this).attr("type") === "hidden") {
				// obj[item.attr("name")] = item.attr("value");
				// console.log("name", item.attribs.name);
				obj[that.$(item).attr("name")] = that.$(this).attr("value");
			}
		});

		var options = {
			"url": action,
			"method": "POST",
			"form": obj
		};

		// console.log("Options", options);

		return engine.get(options);
	}
});

POSTResponse.detect = function(response, body, c) {
	if (response.statusCode === 200 && c("title").text() === "POST data") {
		return new POSTResponse(response, body, c);
	}
	return null;
}




exports.POSTResponse = POSTResponse;