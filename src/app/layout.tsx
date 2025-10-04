import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Are We biome Yet?",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="https://biomejs.dev/img/favicon.svg" type="image/svg+xml"/>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
