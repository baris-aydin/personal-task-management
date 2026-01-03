import { createApp } from "./app";
import { connectDb } from "./db";
import { config } from "./config";

async function main() {
  await connectDb();
  const app = createApp();

  app.listen(config.port, () => {
    console.log(`✅ API listening on http://localhost:${config.port}`);
  });
}

main().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
