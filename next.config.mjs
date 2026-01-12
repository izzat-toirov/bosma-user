/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true, // BU QATORNI QO'SHING
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
