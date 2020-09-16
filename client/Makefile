build: build/videosdr-min.js

build/videosdr-min.js: videosdr.js
	mkdir -p build
	curl -X POST -s --data-urlencode 'input@videosdr.js' https://javascript-minifier.com/raw > build/minifier.output
	if ( head -1 build/minifier.output | grep " Error " > /dev/null ) ; then cat build/minifier.output ; false ; else true ; fi
	mv build/minifier.output build/videosdr-min.js

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
