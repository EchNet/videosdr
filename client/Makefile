minified: build/videosdr-min.js build/optin-min.js

build/videosdr-min.js: build videosdr.js
	../node_modules/.bin/minify videosdr.js > build/videosdr-min.js

build/optin-min.js: build optin.js
	../node_modules/.bin/minify optin.js > build/optin-min.js

deploy: check-aws-env minified
	aws s3 --profile ${AWS_PROFILE} sync ./build s3://${CODE_BUCKET_NAME} --exclude minifier.output

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
