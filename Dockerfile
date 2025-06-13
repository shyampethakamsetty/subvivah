# 1. Select a base image
FROM node:20-alpine AS base

# Set the working directory in the container
WORKDIR /app

# 2. Copy package.json and package-lock.json
COPY package*.json ./

# 3. Install dependencies
RUN npm install

# 4. Copy the rest of your application code
COPY . .

# 5. Build your Next.js application
RUN npm run build

# 6. Expose the port your application runs on
EXPOSE 3000

# 7. Define the command to run your application
CMD ["npm", "start"] 