const request = require("supertest");
const { MongoClient } = require("mongodb");
const { app } = require("../dist/app");

describe("app.get('/')", () => {
  it("should return string `ayo`", async () => {
    const res = await request(app).get("/");
    expect(res.status).toEqual(200);
    expect(res.text).toBe("ayo");
  });
});

