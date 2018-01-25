"use strict";

var Response = require('../Engine/Response').Response;

var PasswordDialogResponse = Response.extend({
	"init": function(response, body, c) {
		this._super(response, body, c);
		this.type = "PasswordDialogResponse";

		this.u = null;
		this.p = null;
		this.idphostname = 'idp.feide.no';
	},
	"setCredentials": function(u, p) {
		this.u = u;
		this.p = p;
	},
	"setIdPhostname": function(idphostname) {
		if (typeof idphostname !== 'undefined') {
			this.idphostname = idphostname;
		}
	},
	"next": function(engine) {
		var that = this;
		var obj = {};
		var orgoptions = {};

		var action = 'https://' + this.idphostname + '/simplesaml/module.php/feide/login.php';

		var actionqs = this.$("form.pure-form").attr("action");

		action += actionqs;

		// consoel.log("Actioun qs")

		this.$("input").each(function(i, item) {
			// console.log("item", this.$(item));
			if (that.$(this).attr("type") === "hidden") {
				// obj[item.attr("name")] = item.attr("value");
				// console.log("name", item.attribs.name);
				obj[that.$(item).attr("name")] = that.$(this).attr("value");
			}
		});

		// console.log("Action:", action);


		if ((this.u === null) || (this.p === null)) {
			throw new Error("Username or password is not set.");
		}

		obj.feidename = this.u;
		obj.password = this.p;

		var options = {
			"url": action,
			"method": "POST",
			"form": obj
		};
		// console.log("Options", options);

		return engine.get(options);
	}
});
PasswordDialogResponse.detect = function(response, body, c) {


	if (response.statusCode === 200 && c("title").text() === "Log in with Feide") {
		return new PasswordDialogResponse(response, body, c);
	}
	return null;
}


exports.PasswordDialogResponse = PasswordDialogResponse;
