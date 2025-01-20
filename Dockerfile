FROM node:lts-slim


WORKDIR /app


#env
ENV NODE_ENV=development
ENV PGHOST=ep-crimson-dream-a1e0ybui-pooler.ap-southeast-1.aws.neon.tech
ENV PGUSER=neondb_owner
ENV PGDATABASE=neondb
ENV PGPASSWORD=cOuotxzGw68s
ENV SCHEDULE_TIME=18:00
ENV SECRET_KEY=secret
ENV SMTP_PORT=465
ENV SMTP_USER=andrianaji06@gmail.com
ENV SMTP_PASS=iogzujjzvlfdztpv
ENV EMAIL_FROM="CRM <andrianaji06@gmail.com>"
ENV NODE_ENV=production
ENV RABBITMQ_URL=amqps://vxqkmcqi:qhu2wgViCT6nACszUcn_Z8RAcY1Aoh5n@horse.lmq.cloudamqp.com/vxqkmcqi

COPY package.json package-lock.json /app/


RUN npm install && npm cache clean --force
RUN npm install -g nodemon




COPY ./ ./


CMD ["npm", "start"]


