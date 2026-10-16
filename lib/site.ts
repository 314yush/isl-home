/** Set SITE_URL to the public HTTPS origin before launch. */
export const siteUrl = process.env.SITE_URL
  ? new URL(process.env.SITE_URL).origin
  : null;
export const indexable =
  Boolean(siteUrl) &&
  process.env.VERCEL_ENV !== "preview" &&
  process.env.VERCEL_ENV !== "development";
