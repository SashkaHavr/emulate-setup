# Emulate config

Configuration and Docker image for running [emulate](https://emulate.dev/)
locally as a Google OAuth emulator.

## Environment variables

- `EMULATE_SECRET`: OAuth client secret exposed by the emulator. Defaults
  to `GOCSPX-secret`. The client ID is
  `my-client-id.apps.googleusercontent.com`. Use
  `GOCSPX-${{ secret(10) }}` to generate a compatible secret.
- `EMULATE_URIS`: Additional OAuth redirect URIs. Defaults to `[]`. The value
  must be a JSON-encoded array of strings. `localhost` and `127.0.0.1` are
  always included.

## Docker Compose reverse proxy

Start Emulate together with the Traefik reverse proxy:

```sh
bun compose
```

This command creates the external `devcontainer-proxy` Docker network when
needed, builds the emulator, and starts the stack. It provides:

- Emulate at [http://emulate.localhost](http://emulate.localhost)
- The Traefik dashboard at [http://traefik.localhost](http://traefik.localhost)
- A read-only Docker socket proxy used by Traefik for service discovery

Traefik binds to `127.0.0.1:80`, so port 80 must be available on the host.

### Devcontainer integration

Attach a development container to the same external network in the project's
Docker Compose file:

```yaml
services:
  devcontainer:
    networks:
      - devcontainer-proxy
    labels:
      - traefik.enable=true
      - traefik.http.routers.<app-service>.rule=Host(`<service>.<app>.localhost`)
      - traefik.http.routers.<app-service>.service=<app-service>
      - traefik.http.services.<app-service>.loadbalancer.server.port=3000
    environment:
      GOOGLE_CLIENT_ID: my-client-id.apps.googleusercontent.com
      GOOGLE_CLIENT_SECRET: GOCSPX-secret
      GOOGLE_EMULATE_URL: http://emulate.localhost

networks:
  devcontainer-proxy:
    external: true
```
