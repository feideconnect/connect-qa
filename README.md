# Connect QA


Functional test suite against Connect Platform.

	npm install
	npm install -g bunyan


To run tests:

	clear; PASSWORD=xxxx node index.js | bunyan -L


CLI options

	Usage: node ./index.js --set [string]

	Options:
	  --set   Select configuration set, as specified in config.json
	  --help  Show this help      

In example, we could selet whether we run against dev og prod environment.

	$ node ./index.js --set prod
