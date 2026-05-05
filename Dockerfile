FROM node:20-alpine

# install dependencies for timezone settings
ENV TZ=Europe/Berlin
RUN apk add --no-cache tzdata \
    && ln -snf /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo ${TZ} > /etc/timezone

# set working folder
WORKDIR /opt/masta

# Copy necessary files
COPY package.json ./
RUN npm i --verbose

# Install dependencies
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Run as non-root user for security
USER node

CMD ["node", "build/main.js"]