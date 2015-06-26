"use strict";

var Response = require('../Engine/Response').Response;

var ConnectConsentResponse = Response.extend({
	"init": function(response, body, c) {
		this._super(response, body, c);
		this.type = "ConnectConsentResponse";
	},
	"next": function(engine) {
		var that = this;
		var obj = {};
		var orgoptions = {};

		var action = this.$("form").attr("action");

		this.$("input").each(function(i, item) {
			// console.log("item", this.$(item));
			if (that.$(this).attr("type") === "hidden") {
				// obj[item.attr("name")] = item.attr("value");
				// console.log("name", item.attribs.name);
				obj[that.$(item).attr("name")] = that.$(this).attr("value");
			}
		});

		// obj.yes = "Ja, jeg holder på å teste innlogging, og vet dette er et test-system.";

		// this.debug();
		var options = {
			"url": action,
			"method": "POST",
			"form": obj
		};
		// console.log(options);


		return engine.get(options);
	}
});

ConnectConsentResponse.detect = function(response, body, c) {


	if (response.statusCode === 200 && c("title").text() === "Authorization Required") {
		return new ConnectConsentResponse(response, body, c);
	}
	return null;
}

exports.ConnectConsentResponse = ConnectConsentResponse;
