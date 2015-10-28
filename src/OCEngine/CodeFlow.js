"use strict";

var url = require('url');
var querystring = require('querystring');

var uuid = require('uuid');


var request = require('request');
var cheerio = require('cheerio');
var extend = require('extend');
// var Engine = require('../Engine/Engine').Engine;

var OCEngine = require('./OCEngine').OCEngine;

var POSTResponse = require('./POSTResponse').POSTResponse;
var SelectProviderResponse = require('./SelectProviderResponse').SelectProviderResponse;
var RedirectResponse = require('./RedirectResponse').RedirectResponse;
var SelectOrgResponse = require('./SelectOrgResponse').SelectOrgResponse;
var PasswordDialogResponse = require('./PasswordDialogResponse').PasswordDialogResponse;
var PreProdWarningResponse = require('./PreProdWarningResponse').PreProdWarningResponse;
var ConnectConsentResponse = require('./ConnectConsentResponse').ConnectConsentResponse;


var AccessToken = require('../OpenID/AccessToken').AccessToken;
var AuthorizationRequest = require('../OpenID/AuthorizationRequest').AuthorizationRequest;

var assert = require('chai').assert;

var default_config = {
    "org": "feide.no",
    "username": "test",
    "password": "098asd",

    "oauth_authorization": "https://auth.dev.feideconnect.no/oauth/authorization",
    "oauth_token": "https://auth.dev.feideconnect.no/oauth/token",
    "oauth_userinfo": "https://auth.dev.feideconnect.no/userinfo",

    "client_id": "5ac8753f-8296-41bf-b985-59d89769005e",
    "client_secret": "b835cb53-6bc9-49c7-89a2-d9149a7f917e",
    "redirect_uri": "https://op.certification.openid.net:60334/authz_cb"
};



var CodeFlow = OCEngine.extend({
    "init": function(config) {

        this._super();
        this.config = extend(true, default_config, config ||  {});

        this.title = "code";

    },

    "resolveCode": function(code) {

        // console.log("resolve ", code);

        var obj = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": this.config.redirect_uri,
            "client_id": this.config.client_id
        };

        var opts = {
            "url": this.config.oauth_token,
            "method": "POST",
            "form": obj,
            'auth': {
                'user': this.config.client_id,
                'pass': this.config.client_secret,
                'sendImmediately': true
            }
        };
        // console.log(opts);

        return this.getJSON(opts);

    },



    "run": function() {

        this.state = uuid.v4();


        var ar = new AuthorizationRequest();
        ar.response_type = "code";
        ar.state = this.state;
        ar.client_id = this.config.client_id;
        ar.redirect_uri = this.config.redirect_uri;


        var rurl = this.config.oauth_authorization + '?' + querystring.stringify(ar);
        console.log("Authorization request ", rurl);


        var that = this;
        return this.get(rurl)
            .then(function(response) {

                if (response instanceof SelectProviderResponse) {
                    return response.next(that);
                }
                throw new Error("At the first step we expected a Select Provider page, but we did not see that");

            }).then(function(response) {

                if (response instanceof SelectOrgResponse) {
                    response.selectOrg(that.config.org);
                    response.setIdPhostname(that.config.idphostname);
                    return response.next(that);
                }
                throw new Error("We expected a SelectOrg page.");

            })
            .then(function(response) {

                if (response instanceof PasswordDialogResponse) {
                    response.setCredentials(that.config.username, that.config.password);
                    response.setIdPhostname(that.config.idphostname);
                    return response.next(that);
                }
                throw new Error("We expected a PasswordDialogResponse");

            })
            .then(function(response) {

                if (response instanceof RedirectResponse) {
                    return response.next(that);
                }
                return response;

            })
            .then(function(response) {

                if (response instanceof PreProdWarningResponse) {
                    return response.next(that);
                }
                return response;

            })
            .then(function(response) {

                if (response instanceof POSTResponse) {
                    return response.next(that);
                }
                throw new Error("We expected a HTTP POST html page.");

            })
            .then(function(response) {

                if (response instanceof RedirectResponse) {
                    return response.next(that);
                }
                return response;

            })
            .then(function(response) {

                if (response instanceof ConnectConsentResponse) {
                    return response.next(that);
                }
                throw new Error("We expected a Consent page.");

            })
            .then(function(response) {

                if (response instanceof RedirectResponse) {
                    var redirect_uri = response.getURL();
                    var up = url.parse(redirect_uri, true);

                    assert(up.query.state, that.state, "State together with code is identical to in the request");
                    var code = up.query.code;

                    return that.resolveCode(code);

                }
                throw new Error("Expected a redirect to the redirect_uri.");

            })
            .then(function(data) {

                var token = new AccessToken(data);

                // console.log("---- TOKEN");
                // console.log(token);

                assert.isAbove(token.expires_in, 12000, 'Expires in token duration should be long enought');
                assert.equal(token.token_type, "Bearer", "Token type should equal Bearer");
                // assert.equal(token.state, that.state, "State with token should match state in request.");

                that.token = token;
                return token;

            })
            .then(function(token) {

                return that.getUserInfo(token);

            })
            .then(function(info) {

                console.log("---- Userinfo");
                console.log(info);

                assert.equal(that.config.client_id, info.audience, "Verify audience of userinfo endpoint");


                that.done();
                return that.token;
            })
            .catch(function(error) {
                console.error("ERROR", error);
                console.log(error.stack);
            });

    }


});

exports.CodeFlow = CodeFlow;