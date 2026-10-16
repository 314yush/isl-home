import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
require("@next/env").loadEnvConfig(process.cwd(), false);
const failures = [];
try {
  const url = new URL(process.env.SITE_URL ?? "");
  if (
    url.protocol !== "https:" ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.username ||
    url.password ||
    ["localhost", "127.0.0.1"].includes(url.hostname)
  )
    throw new Error();
} catch {
  failures.push("Set SITE_URL to the public HTTPS origin, without a path.");
}
if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
)
  failures.push(
    "Configure both Upstash Redis REST variables for shared production caching.",
  );
if (process.env.DATA_PROVIDER && process.env.DATA_PROVIDER !== "espn")
  failures.push(
    "Launch with DATA_PROVIDER=espn; API-Football is not implemented.",
  );
if (failures.length) {
  console.error(
    "Launch configuration incomplete:\n" +
      failures.map((message) => `- ${message}`).join("\n"),
  );
  process.exitCode = 1;
} else
  console.log(
    "Launch configuration present. Verify Redis connectivity through /api/health after deployment.",
  );
