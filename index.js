


var ConnectQA = require('./src/ConnectQA').ConnectQA;



var c = new ConnectQA();
c.run(); 


setTimeout(function() {
	console.log("Done");
}, 30000);