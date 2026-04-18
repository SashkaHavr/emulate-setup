FROM oven/bun:1.3.11-alpine 
WORKDIR /app
COPY . .
RUN bun ci --production
CMD [ "bunx", "emulate", "--service", "google" ]
