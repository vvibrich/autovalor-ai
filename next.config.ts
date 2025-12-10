import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        // @ts-expect-error - Runtime is not in types but required for Netlify
        runtime: "nodejs",
    },
};

export default nextConfig;
