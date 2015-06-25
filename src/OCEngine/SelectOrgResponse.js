"use strict";

var Response = require('../Engine/Response').Response;

var SelectOrgResponse = Response.extend({
	"init": function(response, body, c) {
		this._super(response, body, c);
		this.type = "SelectOrgResponse";
	},
	"next": function(engine) {
		var that = this;
		var obj = {};
		var orgoptions = {};

		var action = 'https://idp-test.feide.no/simplesaml/module.php/feide/login.php';

		this.$("input").each(function(i, item) {
			// console.log("item", this.$(item));
			if (that.$(this).attr("type") === "hidden") {
				// obj[item.attr("name")] = item.attr("value");
				// console.log("name", item.attribs.name);
				obj[that.$(item).attr("name")] = that.$(this).attr("value");
			}
		});
		

		this.$("select#org option").each(function(i, item) {
			var key   = that.$(this).attr("value");
			var value = that.$(this).text();
			orgoptions[key] = value;
		});
		// console.log("Action:", action);
		// console.log("Org options:", orgoptions);
		// console.log("Parameters:", obj);

		obj.org = "feide.no";


		var options = {
			"url": action,
			"qs": obj
		};

		// console.log("Options", options);

		return engine.get(options);
	}
});
SelectOrgResponse.detect = function(response, body, c) {

	if (response.statusCode === 200) {

		if (c("div#orgframe fieldset select#org").attr("name") === "org") {
			return new SelectOrgResponse(response, body, c);
		}

	}
	return null;
}


exports.SelectOrgResponse = SelectOrgResponse;