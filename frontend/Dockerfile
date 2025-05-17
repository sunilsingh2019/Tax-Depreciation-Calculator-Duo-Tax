FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --include=dev

# Explicitly install chart.js and react-chartjs-2
RUN npm install chart.js@^4.0.0 react-chartjs-2@^5.0.0

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 