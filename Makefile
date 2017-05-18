VERSION = $(shell sed -n 's/"version": "\([^"]*\)",/\1/p' < src/manifest.json | tr -d ' ')

build:
	cd src && \
	zip ../dist/labur-eus-${VERSION}.xpi -r .
