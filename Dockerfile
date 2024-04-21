FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Install bun
RUN npm install -g bun

# Install app dependencies
COPY package*.json ./
RUN bun install

# Bundle app source
COPY . .
RUN bun build

# Start the app
CMD [ "bun", "run", "src/index.ts" ]