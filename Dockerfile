FROM mhart/alpine-node
MAINTAINER Indexyz <r18@indexes.nu>


RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN cd /usr/src/app && npm install

EXPOSE 8080:80

ENTRYPOINT ["node"]
CMD ["app.js"]