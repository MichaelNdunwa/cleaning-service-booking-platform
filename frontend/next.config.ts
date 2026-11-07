import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    const odooBaseUrl = (process.env.ODOO_BASE_URL || "http://localhost:9090").replace(/\/+$/, "");
    return [
      {
        source: "/api/v1/:path*",
        destination: `${odooBaseUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
