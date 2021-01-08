minified: build/videosdr-min.js build/optin-min.js build/demo1.json build/optin-modal.css build/optin-hover.css

build/videosdr-min.js: build videosdr.js
	../node_modules/.bin/minify videosdr.js > build/videosdr-min.js

build/optin-min.js: build optin.js
	../node_modules/.bin/minify optin.js > build/optin-min.js

build/demo1.json: demo1.json
	cp demo1.json build

build/optin-modal.css: optin-modal.css
	cp optin-modal.css build

build/optin-hover.css: optin-hover.css
	cp optin-hover.css build

deploy: check-aws-env minified
	aws s3 --profile ${AWS_PROFILE} sync ./build ${OPTIN_HOME} --exclude minifier.output
	aws s3 --profile ${AWS_PROFILE} cp --content-type 'application/js; charset=utf-8' ./build/optin-min.js ${OPTIN_HOME}/optin-min.js

build:
	mkdir -p build

clean:
	rm -rf build

check-aws-env:
ifndef AWS_PROFILE
	$(error AWS_PROFILE is undefined)
endif
ifndef CODE_BUCKET_NAME
	$(error CODE_BUCKET_NAME is undefined)
endif
ifndef OPTIN_HOME
	$(error OPTIN_HOME is undefined)
endif
