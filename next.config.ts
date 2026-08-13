import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	basePath: "/are-we-biome-yet",
	assetPrefix: "/are-we-biome-yet",
	experimental: {
		useTypeScriptCli: true,
	},
};

export default nextConfig;
