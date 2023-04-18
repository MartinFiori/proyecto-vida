FROM node:lts-alpine3.13

# create the directory inside the container
WORKDIR /usr/src/vida-front

# copy the package.json files from local machine to the workdir in container
COPY package*.json ./
RUN apk add python3 py3-pip
RUN apk add make
RUN apk add g++

RUN npm install -g npm@latest
RUN npm install --save
RUN npm audit fix --force
RUN npm install --save express	
RUN npm install -g express	
RUN npm install --save dotenv

COPY --chown=node:node . .

COPY . /usr/src/vida-front


# our app is running on port 5000 within the container, so need to expose it
EXPOSE 80

# the command that starts our app

CMD ["node", "index.js"]
