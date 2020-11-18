build: build/videosdr-min.js

build/videosdr-min.js: videosdr.js
	mkdir -p build
	../node_modules/.bin/minify videosdr.js > build/videosdr-min.js

test:
	echo "No tests yet"

deploy: check-env build/videosdr-min.js
	aws s3 --profile ${AWS_PROFILE} cp build/videosdr-min.js s3://${CODE_BUCKET_NAME}

clean:
	rm -rf build

check-env:
ifndef AWS_PROFILE
	$(error AWS_PROFILE is undefined)
endif
ifndef CODE_BUCKET_NAME
	$(error CODE_BUCKET_NAME is undefined)
endif
