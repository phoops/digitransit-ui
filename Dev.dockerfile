FROM node:lts

LABEL  maintainer="Phoops info@phoops.it"
LABEL  environment="development"

WORKDIR /app
ADD . /app

ENV CONFIG=mint

RUN \
    yarn install --silent && \
    yarn predev

EXPOSE 8080

CMD yarn run dev
