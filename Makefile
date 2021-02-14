all: clean npm ur-client ur-server

npm:
	npm install

ur-client:
	mkdir client/lib
	cp client/index.html client/lib/index.html
	cp -R client/css client/lib/css
	cp -R client/img client/lib/img
	tsc client/ts/main.ts	
	@echo built client

ur-server:
	tsc server/index.ts

clean:
	rm -rf client/lib server/lib