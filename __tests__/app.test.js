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

describe("POST: /api/reviews/:review_id/comments", () => {
  test("201: get posted comment", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({ username: "mallionaire", body: "This game is awesome!" })
      .expect(201)
      .then(({ body: comment }) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This game is awesome!",
          review_id: 3,
          author: "mallionaire",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("404: valid review id format but id does not exist", () => {
    return request(app)
      .post("/api/reviews/30/comments")
      .send({ username: "happyamy2016", body: "This game is awesome!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });

  test("400: invalid review id format", () => {
    return request(app)
      .post("/api/reviews/banana/comments")
      .send({ username: "happyamy2016", body: "This game is awesome!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: incorrect keys on req body", () => {
    return request(app)
      .post("/api/reviews/banana/comments")
      .send({ user: "happyamy2016", object: "This game is awesome!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("400: invalid value on request body", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({ username: 10, body: 10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("404: username not found", () => {
    return request(app)
      .post("/api/reviews/4/comments")
      .send({ username: "bakrikhalifa", object: "This game is awesome!" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH: /api/reviews/:review_id", () => {
  test("200: should return updated review if req body wants to add", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: 2 })
      .expect(200)
      .then(({ body: updatedReview }) => {
        expect(updatedReview).toMatchObject({
          review_id: 3,
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 7,
        });
      });
  });
  test("200: should return updated review if req body wants to subtract", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body: updatedReview }) => {
        expect(updatedReview).toMatchObject({
          review_id: 3,
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: 4,
        });
      });
  });
  test("404: valid review id format but id does not exist ", () => {
    return request(app)
      .patch("/api/reviews/20")
      .send({ inc_votes: 2 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: invalid review id format ", () => {
    return request(app)
      .patch("/api/reviews/banana")
      .send({ inc_votes: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404: incorrect key on req body ", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ votes: 2 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: incorrect value on req body ", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ inc_votes: "Ten" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
