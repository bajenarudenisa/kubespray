const assert = require("node:assert/strict");
const { test } = require("node:test");
const { createServer } = require("./server");

async function withServer(run) {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();

  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

test("GET /Hola/Bubietii returns the greeting JSON", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/Hola/Bubietii`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /application\/json/);
    assert.deepEqual(await response.json(), {
      message: "Hello Fantomitze from Linkedin Learning",
    });
  });
});

test("GET /health reports healthy", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  });
});

test("unknown paths return JSON 404", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/unknown`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: "Not Found" });
  });
});

test("non-GET greeting requests return JSON 405", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/Hola/Bubietii`, { method: "POST" });
    assert.equal(response.status, 405);
    assert.deepEqual(await response.json(), { error: "Method Not Allowed" });
  });
});
