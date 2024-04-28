FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install bun
RUN npm install -g bun

# Install app dependencies
COPY package*.json ./
RUN bun install

# Prisma
RUN npx prisma generate
RUN npx prisma db push
RUN npx prisma migrate dev --name init

# Bundle app source
COPY . .
RUN bun build

# Start the app
CMD [ "bun", "run", "dist/index.js" ]