FROM mhart/alpine-node
MAINTAINER Indexyz <jiduye@gmail.com>

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app
RUN cd /usr/src/app && npm install

EXPOSE 3000:80

ENTRYPOINT ["node"]
CMD ["app.js"]