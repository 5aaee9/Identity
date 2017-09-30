FROM mhart/alpine-node:8.6.0
MAINTAINER Indexyz <jiduye@gmail.com>

ARG VCS_REF

LABEL org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="e.g. https://github.com/Indexyz/Identity"
      
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN cd /usr/src/app && yarn

EXPOSE 3000:80

ENTRYPOINT ["node"]
CMD ["Bin/run"]
