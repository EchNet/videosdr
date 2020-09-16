build: build/videosdr-min.js

build/videosdr-min.js: videosdr.js
	mkdir -p build
	curl -X POST -s --data-urlencode 'input@videosdr.js' https://javascript-minifier.com/raw > build/minifier.output
	if ( head -1 build/minifier.output | grep " Error " > /dev/null ) ; then cat build/minifier.output ; false ; else true ; fi
	mv build/minifier.output build/videosdr-min.js

test:
	echo "No tests yet"

deploy:
	echo "Nothing to deploy"

clean:
	rm -rf build
