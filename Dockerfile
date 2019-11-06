FROM node:8-alpine

# install things we'll need
RUN apk update \
    && apk upgrade \
    && apk add bash curl

# setup Kuma
RUN mkdir kuma/ \
    && cd kuma/ \
    && wget https://kong.bintray.com/kuma/kuma-0.2.2-centos-amd64.tar.gz \
    && tar -xvzf kuma-0.2.2-centos-amd64.tar.gz \
    && chmod +x bin/* \
    && cp bin/* /usr/bin/
