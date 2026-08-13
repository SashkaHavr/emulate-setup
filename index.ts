import { createEmulator } from "emulate";

console.log("Starting emulator...");

const secret = process.env.EMULATE_SECRET ?? "GOCSPX-secret";
const uris: string[] = process.env.EMULATE_URIS ? JSON.parse(process.env.EMULATE_URIS) : [];

const users = Array.from({ length: 20 }).map((_, i) => ({
  email: `user${i}@example.com`,
  name: `Test User ${i}`,
}));

const google = await createEmulator({
  service: "google",
  port: 80,
  seed: {
    google: {
      users,
      oauth_clients: [
        {
          client_id: "my-client-id.apps.googleusercontent.com",
          client_secret: secret,
          redirect_uris: ["localhost", "127.0.0.1", ...uris],
        },
      ],
    },
  },
});

process.on("SIGINT", async () => {
  console.log("Closing emulator...");
  await google.close();
});
