# Use Node.js LTS version
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Run the compiled app
CMD ["node", "build/index.js"]