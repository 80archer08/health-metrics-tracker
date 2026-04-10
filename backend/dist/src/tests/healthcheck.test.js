"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const app_1 = __importDefault(require("../app"));
(0, node_test_1.default)("GET /api/healthcheck returns OK", async () => {
    const server = app_1.default.listen(0);
    try {
        const address = server.address();
        if (!address || typeof address === "string") {
            throw new Error("Unable to resolve test server port");
        }
        const response = await fetch(`http://127.0.0.1:${address.port}/api/healthcheck`);
        const body = await response.json();
        strict_1.default.equal(response.status, 200);
        strict_1.default.deepEqual(body, { status: "OK" });
    }
    finally {
        server.close();
    }
});
//# sourceMappingURL=healthcheck.test.js.map