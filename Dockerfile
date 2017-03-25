FROM hyalx/node.js
MAINTAINER Indexyz <r18@indexes.nu>


RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN npm install --production

EXPOSE 3000:80

ENTRYPOINT ["node"]
CMD ["app.js"]