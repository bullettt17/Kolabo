/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  // The 8 near-identical "for brands" / "for creators" template pages were
  // consolidated down to 6 (marketing-teams merged into agencies;
  // photographers-videographers merged into ugc). These redirects keep the
  // old URLs working for anyone with them bookmarked or linked.
  async redirects() {
    return [
      {
        source: "/for-brands/marketing-teams",
        destination: "/for-brands/agencies",
        permanent: true,
      },
      {
        source: "/for-creators/photographers-videographers",
        destination: "/for-creators/ugc",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
