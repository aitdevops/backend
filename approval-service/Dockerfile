# Dockerfile for Approval Service

# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Verify that express is installed
RUN ls node_modules | grep express

# Copy the rest of the application code
COPY . .

# Expose the port that the application will run on
EXPOSE 3003

# Define the command to run the application
CMD ["node", "app.js"]
