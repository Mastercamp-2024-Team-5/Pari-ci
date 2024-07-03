# Node.js base image
FROM node:18-alpine

# working directory
WORKDIR /usr/src/app

# install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the code
COPY . .

# Build the application
RUN npm run build

# Expose the port on which the application runs
EXPOSE 5173

# run the application
CMD ["npm", "run", "dev"]
