import test from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";

test("GET /api/healthcheck returns OK", async () => {
  const server = app.listen(0);

  try {
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Unable to resolve test server port");
    }

    const response = await fetch(`http://127.0.0.1:${address.port}/api/healthcheck`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, { status: "OK" });
  } finally {
    server.close();
  }
});
