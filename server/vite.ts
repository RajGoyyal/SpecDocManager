import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(_app: Express, _server: Server) {
  // React/Vite dev integration removed. Angular dev server should be run separately.
  log("Vite dev server is disabled. Run Angular dev server in client-angular.", "server");
}

export function serveStatic(app: Express) {
  // Serve Angular browser build output
  const angularBrowserDist = path.resolve(
    import.meta.dirname,
    "..",
    "client-angular",
    "dist",
    "client-angular",
    "browser",
  );

  if (!fs.existsSync(angularBrowserDist)) {
    throw new Error(
      `Could not find Angular build at ${angularBrowserDist}. Build the Angular client first (cd client-angular; npm run build).`,
    );
  }

  app.use(express.static(angularBrowserDist));

  // fall through to index.html for client routes
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(angularBrowserDist, "index.html"));
  });
}
