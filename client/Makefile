minified: build/videosdr-min.js

build/videosdr-min.js: build videosdr.js
	../node_modules/.bin/minify videosdr.js > build/videosdr-min.js

deploy: check-aws-env minified
	aws s3 --profile ${AWS_PROFILE} cp --content-type 'application/js; charset=utf-8' ./build/videosdr-min.js s3://${CODE_BUCKET_NAME}/videosdr-min.js

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
