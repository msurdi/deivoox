FROM node:18

USER root
ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npx playwright install --with-deps chromium
EXPOSE 8080
CMD ["npm" , "start"]
