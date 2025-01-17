FROM node:lts-slim


WORKDIR /app


#env


COPY package.json package-lock.json /app/


RUN npm install && npm cache clean --force
RUN npm install -g nodemon




COPY ./ ./


CMD ["npm", "start"]


