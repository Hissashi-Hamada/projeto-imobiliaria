FROM node:20-bullseye

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* /usr/src/app/
RUN npm install --legacy-peer-deps || npm install || true

# Copy source
COPY . /usr/src/app

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
