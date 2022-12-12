const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("Test for incorrect path", () => {
    test.only("404: non existant path", () => {
      return request(app)
        .get("/aps")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });

describe("GET api/categories", () => {
  test("200: should succesfully get categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: categories }) => {
        categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
        expect(categories.length).toBe(4)
      });
  });
});
