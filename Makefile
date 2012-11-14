THEME = $(HOME)/.liquidluck-themes/arale2


build:
	spm build -v

doc:
	liquidluck build -v -s $(THEME)/settings.yml

debug:
	liquidluck server -d -s $(THEME)/settings.yml

server:
	liquidluck server -s $(THEME)/settings.yml

test:
	phantomjs $(THEME)/static/js/run_jasmine_test.coffee http://127.0.0.1:8000/tests/runner.html
