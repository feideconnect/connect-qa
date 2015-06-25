
"use strict";

var request = require('request');
var cheerio = require('cheerio');

var Engine = require('../Engine/Engine').Engine;

var POSTResponse 			= require('./POSTResponse').POSTResponse;
var SelectProviderResponse 	= require('./SelectProviderResponse').SelectProviderResponse;
var RedirectResponse 		= require('./RedirectResponse').RedirectResponse;
var SelectOrgResponse		= require('./SelectOrgResponse').SelectOrgResponse;
var PasswordDialogResponse	= require('./PasswordDialogResponse').PasswordDialogResponse;


var OCEngine = Engine.extend({
	"init": function() {
		this._super();
		this.responseinspector
			.add(POSTResponse)
			.add(SelectProviderResponse)
			.add(RedirectResponse)
			.add(SelectOrgResponse)
			.add(PasswordDialogResponse)
			;
	},
	"run": function() {

		var that = this;
		this.get("https://auth.dev.feideconnect.no/oauth/authorization?response_type=token&state=bbdfd163-fe09-45de-b2b5-29b880d773c0&redirect_uri=https%3A%2F%2Fmin.dev.feideconnect.no%2FpassiveCallback.html&client_id=c148bc3f-6b15-47d7-ad23-3c36677eb8b5")
			.then(function(response) {


				if (response instanceof POSTResponse) {
					return response.next(that);

				} else if (response instanceof SelectProviderResponse) {
					return response.next(that);
				}

				throw new Error("At the first step we expected a Select Provider page, but we did not see that");


			}).then(function(response) {

				console.log(" ----------- ----------- ----------- ----------- -----------");
				if (response instanceof POSTResponse) {
					return response.next(that);

				} else if (response instanceof RedirectResponse) {
					return response.next(that);

				} else if (response instanceof SelectOrgResponse) {
					return response.next(that);



				}
				throw new Error("We expected a SelectOrg page.");

			})
			.then(function(response) {

				if (response instanceof PasswordDialogResponse) {

					response.setCredentials("test", "098asd");
					return response.next(that);

				}
				throw new Error("We expected a PasswordDialogResponse");

			})
			.then(function(response) {

				console.log(" ----------- done with password ----------- ----------- ----------- -----------");


				response.debug();


				if (response instanceof PasswordDialogResponse) {




				} else {
					console.error("Uknown respone type");
					console.log(response.body);
				}



			})
			// .catch(function(error) {
			// 	console.error("ERROR", error);
			// 	console.log(JSON.stringify(error));
			// });

	}

	
});

exports.OCEngine = OCEngine;
