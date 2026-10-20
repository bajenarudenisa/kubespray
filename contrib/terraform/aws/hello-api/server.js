const http = require("node:http");

const PORT = Number(process.env.PORT ?? 8989);
const GREETING = "Hello Fantomitze from Linkedin Learning";

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(body));
}

function createServer() {
  return http.createServer((request, response) => {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;

    if (pathname === "/health" && request.method === "GET") {
      return sendJson(response, 200, { status: "ok" });
    }

    if (pathname === "/Hola/Bubietii") {
      if (request.method !== "GET") {
        return sendJson(response, 405, { error: "Method Not Allowed" });
      }

      return sendJson(response, 200, { message: GREETING });
    }

    return sendJson(response, 404, { error: "Not Found" });
  });
}

if (require.main === module) {
  createServer().listen(PORT, "0.0.0.0", () => {
    console.log(`Hello API listening on port ${PORT}`);
  });
}

module.exports = { createServer };
