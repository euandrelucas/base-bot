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

# Start the app
CMD [ "bun", "start", "src/index.ts" ]