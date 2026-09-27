/** @type {import('next').NextConfig} */
const nextConfig={
  output:"export",
  trailingSlash:true,
  basePath:"/pdf-tools",
  assetPrefix:"/pdf-tools/",
  images:{unoptimized:true},
  webpack:(config)=>{
    config.resolve.alias={...(config.resolve.alias||{}),canvas:false};
    return config;
  }
};
export default nextConfig;
