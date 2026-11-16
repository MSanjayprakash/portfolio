const http = require("http"),
  fs = require("fs"),
  path = require("path");
const root = path.join(__dirname, "dist");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
};
http
  .createServer((req, res) => {
    let p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
    if (!p.startsWith(root)) {
      res.writeHead(403);
      return res.end();
    }
    if (!fs.existsSync(p) || fs.statSync(p).isDirectory())
      p = path.join(root, "index.html");
    res.setHeader(
      "Content-Type",
      types[path.extname(p)] || "application/octet-stream",
    );
    fs.createReadStream(p).pipe(res);
  })
  .listen(4287, "127.0.0.1", () => console.log("http://127.0.0.1:4287"));
