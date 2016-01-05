FAKETIME_REPO       := git://github.com/wolfcw/libfaketime.git
FAKETIME_LOCAL_REPO := $(CURDIR)/faketime
FAKETIME_BRANCH     := cae9387908c7cd7ed1c7634ddb6fc72ed370261e
FAKETIME_BINARY     := $(FAKETIME_PREFIX)/bin/faketime

.PHONY: faketime

faketime: $(FAKETIME_BINARY)

clean:
	$(RM) -r $(FAKETIME_LOCAL_REPO)

$(FAKETIME_BINARY): $(FAKETIME_LOCAL_REPO)
	cd $(FAKETIME_LOCAL_REPO) && \
	git checkout $(FAKETIME_COMMIT) && \
	make PREFIX=$(FAKETIME_LOCAL_REPO)/src LIBDIRNAME=''

$(FAKETIME_LOCAL_REPO):
	git clone $(FAKETIME_REPO) $(FAKETIME_LOCAL_REPO)

