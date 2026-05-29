const isPagesBuild = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/es-size-calc",
  assetPrefix: "/es-size-calc/",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: isPagesBuild,
  },
};

export default nextConfig;
