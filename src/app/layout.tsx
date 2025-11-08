import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "./globals.css";

export const metadata: Metadata = {
	title: "Are We biome Yet?",
	description: "An overview of ported popular lint rules to Biome",
	icons: "https://netail.dev/favicon.ico",
};

const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
};

export default RootLayout;
