# Use the official Node.js image.
FROM node:18  AS build

# Set the working directory in the container.
WORKDIR /app

# Copy package.json and package-lock.json.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the application code.
COPY . .

FROM node:18-alpine

WORKDIR /app

COPY --from=build /app .

# Expose the port the app runs on.
# Change this if your app runs on a different port.

# Command to run the app.
CMD ["node", "server.js"]

