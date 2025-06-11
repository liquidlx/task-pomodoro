import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/task-pomodoro",
  assetPrefix: "/task-pomodoro",
  trailingSlash: true,
};

export default nextConfig;
