const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("Test for incorrect path", () => {
  test("404: non existant path", () => {
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
      });
  });
});

describe('GET: "/api/reviews/:review_id"', () => {
  test("200: should get review by correct review id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body: review }) => {
        expect(review).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });

  test("404: correct id format but invalid id", () => {
    return request(app)
      .get("/api/reviews/20")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: incorrect id format", () => {
    return request(app)
      .get("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("200: should return comments in correct order", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: should return comments in correct format", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });
  test("200: valid article but comments do not exist for said article", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(0);
      });
  });

  test("404: valid id format but id does not exist", () => {
    return request(app)
      .get("/api/reviews/20/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: invalid format id", () => {
    return request(app)
      .get("/api/reviews/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

// describe('POST: /api/reviews/:review_id/comments', () => {
//     test('200: get posted comment', () => {
        
//         return request(app)
//         .post('/api/reviews/3/comments')
//         .send({ body: "awesome game, love it",
//     username: 'bakrikhalifa123'})
//     .expect(200)
//     .then(({body: review}) => {
//         expect(review)
//     })
//     });
// });
