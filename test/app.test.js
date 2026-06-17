const request = require("supertest");
const app = require("../src/index");

describe("inventory-service", () => {
  it("health is ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  it("lists inventory", async () => {
    const res = await request(app).get("/inventory");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it("404s unknown item", async () => {
    const res = await request(app).get("/inventory/999");
    expect(res.status).toBe(404);
  });

  it("fails on purpose", async () => {
    const res = await request(app).get("/error");
    expect(res.status).toBe(500);
  });

  it("intentional CI failure", async () => {
    const res = await request(app).get("/health");
    expect(res.body.status).toBe("ok");
  });
});
