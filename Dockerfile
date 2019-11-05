FROM centos

# install things we'll need
RUN yum -y install wget curl which

# setup Kuma
RUN mkdir kuma/ \
    && cd kuma/ \
    && wget https://kong.bintray.com/kuma/kuma-0.2.2-centos-amd64.tar.gz \
    && tar -xvzf kuma-0.2.2-centos-amd64.tar.gz \
    && chmod +x bin/* \
    && cp bin/* /usr/bin/

# expose the port so we can access data
EXPOSE 5681
