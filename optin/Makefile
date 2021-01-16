minified: build/optin-min.js build/demo1.json build/optin-modal.css build/optin-hover.css

build/optin-min.js: build optin.js
	../node_modules/.bin/minify optin.js > build/optin-min.js

deploy: check-aws-env minified
	aws s3 --profile ${AWS_PROFILE} cp --content-type 'application/js; charset=utf-8' ./build/optin-min.js ${OPTIN_HOME}/optin-min.js
	aws s3 --profile ${AWS_PROFILE} cp --content-type 'application/json; charset=utf-8' ./demo1.json ${OPTIN_HOME}/demo1.json
	aws s3 --profile ${AWS_PROFILE} cp --content-type 'text/css; charset=utf-8' ./optin-modal.css ${OPTIN_HOME}/optin-modal.css
	aws s3 --profile ${AWS_PROFILE} cp --content-type 'text/css; charset=utf-8' ./optin-hover.css ${OPTIN_HOME}/optin-hover.css

build:
	mkdir -p build

clean:
	rm -rf build

check-aws-env:
ifndef AWS_PROFILE
	$(error AWS_PROFILE is undefined)
endif
ifndef OPTIN_HOME
	$(error OPTIN_HOME is undefined)
endif
