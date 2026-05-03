FROM node:20-alpine

WORKDIR /opt/masta

# Copy necessary files
COPY . .

# Install dependencies
RUN npm i --verbose
RUN npm run build

# Run as non-root user for security
USER node

CMD ["node", "build/main.js"]