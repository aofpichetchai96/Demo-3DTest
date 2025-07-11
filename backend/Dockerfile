# Use official Node.js runtime as the base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Create uploads and logs directories
RUN mkdir -p uploads logs

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the application
CMD ["npm", "start"]
