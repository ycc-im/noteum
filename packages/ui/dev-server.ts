import { serve } from "bun";
import { join, resolve } from "path";
import { readFileSync, existsSync } from "fs";

const port = 3000;
const projectRoot = import.meta.dir;

console.log(`Starting UI development server on http://localhost:${port}`);

// Create HTML content for the development server
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Components</title>
  <script type="module" src="/src/dev.tsx"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
`;

serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;
    
    // Default path is index.html
    if (path === "/") {
      return new Response(htmlContent, {
        headers: { "Content-Type": "text/html" },
      });
    }
    
    // Handle favicon.ico request
    if (path === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }
    
    try {
      // Try to read the file
      const filePath = join(projectRoot, path);
      
      if (!existsSync(filePath)) {
        return new Response(`Not Found: ${path}`, { status: 404 });
      }
      
      const file = readFileSync(filePath);
      
      // Set Content-Type based on file extension
      const ext = path.split('.').pop() || '';
      const contentType = {
        'html': 'text/html',
        'css': 'text/css',
        'js': 'text/javascript',
        'ts': 'application/javascript',
        'tsx': 'application/javascript',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'svg': 'image/svg+xml',
      }[ext] || 'text/plain';
      
      return new Response(file, {
        headers: { "Content-Type": contentType },
      });
    } catch (e) {
      console.error(`Error serving ${path}:`, e);
      return new Response(`Server Error: ${e.message}`, { status: 500 });
    }
  },
});
