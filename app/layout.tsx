import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@/components/site-nav";

const heading = Fraunces({ subsets: ["latin"], variable: "--font-heading" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: {
    default: "espress.coffee | Premium Coffee Marketplace",
    template: "%s | espress.coffee"
  },
  description:
    "espress.coffee is a premium coffee marketplace for independent roasters, curated gear, and fulfillment-ready coffee ecommerce."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable}`}>
        <SiteNav />
        {children}
        <footer className="footer">
          <div className="container footer-grid">
            <div>
              <div className="brand" style={{ color: "#F7F1E8" }}>
                espress<span>.coffee</span>
              </div>
              <p className="muted" style={{ color: "#d7c7b6" }}>
                Curated roasts, premium brewing gear, and fulfillment workflows for a modern craft coffee market.
              </p>
            </div>
            <div>
              <strong>Marketplace</strong>
              <p><a href="/market">Shop market</a></p>
              <p><a href="/roasters">Roasters</a></p>
              <p><a href="/account">Account</a></p>
            </div>
            <div>
              <strong>Portals</strong>
              <p><a href="/admin">Admin panel</a></p>
              <p><a href="/roaster">Roaster portal</a></p>
              <p><a href="/fulfillment">Fulfillment portal</a></p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
