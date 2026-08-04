FROM oven/bun:1.3.14-slim AS base
WORKDIR /app

FROM base AS build
COPY . .
RUN bun ci
RUN bun run build

FROM base
COPY --from=build /app/dist/ .

CMD [ "bun", "index.js" ]
