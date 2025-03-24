# Stage 1: Build stage
FROM node:20.14.0 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Run stage
FROM node:20.14.0

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=build /app .

# Expose the port that Vite (or React) runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]
