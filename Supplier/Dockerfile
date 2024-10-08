# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install the required packages
RUN npm install

# Copy the rest of your service code
COPY . .

# Start the service
CMD ["node", "service/supplier.js"]
