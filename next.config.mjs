/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  reactStrictMode: true,

  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },

  async redirects() {
    return [
      /**
       * The page sections live in pages/home/ to match the project layout,
       * which makes Next treat each one as its own route. Nobody should land
       * on /home/Hero and see a lone section, so they all fold back to /.
       */
      { source: "/home/:section", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
