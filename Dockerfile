# 1. Use a lightweight Node image
# FROM node:18-alpine
FROM node:22-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy package files first
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of your frontend code
COPY . .

# 6. Expose Vite's default port
EXPOSE 5173

# 7. Run the development server (forcing Vite to expose the host network)
CMD ["npm", "run", "dev", "--", "--host"]