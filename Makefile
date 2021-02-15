all: clean npm ur

npm:
	npm install

ur:
	mkdir -p dist/client dist/server
	rsync -av --exclude='client/main.ts' client dist/
	webpack --mode=development
	@echo built client
	http-server dist/client

clean:
	rm -rf dist

run:
	ts-node server