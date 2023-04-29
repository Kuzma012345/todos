FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Build app
RUN npm run build

# Install postgresql-client
RUN apt-get update && apt-get install -y postgresql-client

# Start server
EXPOSE 5000
CMD [ "npm", "start" ]