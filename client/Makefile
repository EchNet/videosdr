minified: build/videosdr-min.js

build/videosdr-min.js: build videosdr.js
	../node_modules/.bin/minify videosdr.js > build/videosdr-min.js

deploy: check-aws-env minified
	aws s3api --profile ${AWS_PROFILE} put-object --bucket ${CODE_BUCKET_NAME} --content-type 'application/js; charset=utf-8' --cache-control="max-age=3600" --key videosdr-min.js --body ./build/videosdr-min.js

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
