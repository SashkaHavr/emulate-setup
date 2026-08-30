FROM oven/bun:1.4.0-slim AS base
WORKDIR /app

FROM base AS build
COPY . .
RUN bun ci
RUN bun run build

FROM base
COPY --from=build /app/dist/ .

CMD [ "bun", "index.js" ]
