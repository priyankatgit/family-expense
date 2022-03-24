/** @type {import('next').NextConfig} */

const dev = process.env.NODE_ENV !== "production";
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  server: dev ? "http://localhost:3000" : "https://anything.vercel.app",
}

module.exports = nextConfig
