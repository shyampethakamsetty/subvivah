FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY .env .env

COPY . .
RUN npm run build

# Copy static files to the standalone directory
RUN cp -r .next/static .next/standalone/.next/ && \
    cp -r .next/static .next/standalone/.next/static

# Copy public directory to standalone
RUN cp -r public .next/standalone/

EXPOSE 3001

ENV PORT=3001
CMD ["node", ".next/standalone/server.js"]