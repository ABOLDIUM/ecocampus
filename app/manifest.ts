// ============================================================================
// ECOCAMPUS PWA MANIFEST — APP/MANIFEST.TS
// Full-Screen Mobile Installable Configuration for Vercel Deployment
// ============================================================================

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EcoCampus Digital Bank",
    short_name: "EcoCampus",
    description: "Student FinTech, Ecobank Cards, USD Domiciliary & NGX Stock Investment Hub",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f8fafc",
    theme_color: "#007749",
    icons: [
      {
        src: "/brand/ecocampus-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/ecocampus-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}