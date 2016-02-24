#!/usr/bin/env node
"use strict";

var ConnectQA = require('./src/ConnectQA').ConnectQA;
var Slack = require('node-slackr');


var slackkey = process.env.SLACK;

var c = new ConnectQA();
var slack = new Slack(slackkey,{
  channel: "#dataporten",
  username: "dataporten-integration-tst",
  // icon_url: "http://domain.com/image.png",
  icon_emoji: ":ghost:"
});


c.run()
	.catch(function(error) {
		// console.error("ERROR", error);
		slack.notify("Error running Dataporten test: " +  error)
	})
