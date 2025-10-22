# Use a modern, secure Node.js LTS version
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Command to run the application
CMD ["node", "src/index.js"]