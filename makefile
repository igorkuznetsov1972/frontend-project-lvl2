install: install-deps

run:
	bin/gendiff.js

install-deps:
	npm ci

test:
	npx -n --experimental-vm-modules jest

test-coverage:
	np test -- --coverage --coverageProvider=v8

lint:
	npx eslint .

publish:
	npm publish

.PHONY: test