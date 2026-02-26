import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出配置 - 适用于纯客户端应用
  output: "export",
  // 禁用图片优化（静态导出不支持）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
