import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OmniRoute Sentinel — Driver",
  description: "AI-powered driver navigation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        background: '#030712', 
        color: '#f9fafb',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {children}
      </body>
    </html>
  );
}