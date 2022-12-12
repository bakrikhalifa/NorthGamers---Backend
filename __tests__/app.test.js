const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());
beforeEach(() => seed(testData));

<<<<<<< HEAD
=======
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

>>>>>>> main
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
<<<<<<< HEAD
        expect(categories.length).toBe(4);
      });
  });
});

describe("GET /api/reviews", () => {
  test("200: should get all reviews by date descending", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: reviews }) => {
        expect(reviews).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: should get all reviews in correct format", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: reviews }) => {
        reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("200: should have correct lengthed reviews array", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: reviews }) => {
        expect(reviews.length).toBe(13);
=======
        expect(categories.length).toBe(4)
>>>>>>> main
      });
  });
});
