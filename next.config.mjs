/** @type {import('next').NextConfig} */
const nextConfig={
  output:"export",
  trailingSlash:true,
  basePath:"/pdf-tools",
  assetPrefix:"/pdf-tools/",
  images:{unoptimized:true}
};
export default nextConfig;