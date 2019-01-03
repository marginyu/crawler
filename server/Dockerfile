FROM node:latest
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm set registry https://registry.npm.taobao.org
RUN npm install
COPY . /usr/src/app
EXPOSE 3000
CMD [ "npm","start" ]
