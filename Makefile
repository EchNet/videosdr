build: build-client build-ingest build-dataservice

test: test-client test-ingest test-dataservice

deploy: deploy-client deploy-ingest deploy-dataservice

clean: clean-client clean-ingest clean-dataservice

build-client:
	(cd client; make build)

build-ingest:
	(cd ingest; make build)

build-dataservice:
	(cd dataservice; make build)

test-client:
	(cd client; make test)

test-ingest:
	(cd ingest; make test)

test-dataservice:
	(cd dataservice; make test)

deploy-client:
	(cd client; make deploy)

deploy-ingest:
	(cd ingest; make deploy)

deploy-dataservice:
	(cd dataservice; make deploy)

clean-client:
	(cd client; make clean)

clean-ingest:
	(cd ingest; make clean)

clean-dataservice:
	(cd dataservice; make clean)
