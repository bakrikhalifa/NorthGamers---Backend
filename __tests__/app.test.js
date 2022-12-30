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

describe("GET: api/categories", () => {
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

describe("GET: /api/reviews", () => {
  test("200: should get all reviews by default descending", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: reviews }) => {
        expect(reviews.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: should get all reviews in correct format", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body: reviews }) => {
        reviews.reviews.forEach((review) => {
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
        expect(reviews.reviews.length).toBe(13);
      });
  });
  test("200: accepts a category query", () => {
    return request(app)
      .get("/api/reviews?category=euro+game")
      .expect(200)
      .then(({ body: reviewsByCategory }) => {
        reviewsByCategory.reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: "euro game",
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test("404: should test if category is not found", () => {
    return request(app)
      .get("/api/reviews?category=euro")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("200: should return empty array if category exists but there are no associated reviews", () => {
    return request(app)
      .get("/api/reviews?category=children's+games")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toEqual([]);
      });
  });
  test("200: should sort by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then(({ body: sortedBy }) => {
        expect(sortedBy.reviews).toBeSortedBy("votes", { descending: true });
      });
  });
  test("400: sort by spelt wrong", () => {
    return request(app)
      .get("/api/reviews?srot_by=votes")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: invalid sort by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=test")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("200: should return correct result for querying order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then(({ body: reviews }) => {
        expect(reviews.reviews).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("400: invalid order query", () => {
    return request(app)
      .get("/api/reviews?order=ascend")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: order spelt wrong", () => {
    return request(app)
      .get("/api/reviews?odrer=asc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("200: should return default limit of 10 with p query", () => {
    return request(app)
      .get("/api/reviews?limit&p=1")
      .expect(200)
      .then(({ body: limitReviews }) => {
        expect(limitReviews.queryResults).toHaveLength(10);
      });
  });
  test("200: should return default limit of 10 with p query", () => {
    return request(app)
      .get("/api/reviews?limit=5&p=2")
      .expect(200)
      .then(({ body: limitReviews }) => {
        expect(limitReviews.queryResults).toHaveLength(5);
      });
  });
  test("200: should return article count", () => {
    return request(app)
      .get("/api/reviews?limit=5&p=2")
      .expect(200)
      .then(({ body: limitReviews }) => {
        expect(limitReviews.total_count).toEqual(13);
      });
  });
  test("400: limit spelt wrong", () => {
    return request(app)
      .get("/api/reviews?lmit=5&p=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: invalid limit query", () => {
    return request(app)
      .get("/api/reviews?limit=ten&p=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: p spelt wrong query", () => {
    return request(app)
      .get("/api/reviews?limit=5&t=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: invalid p query", () => {
    return request(app)
      .get("/api/reviews?limit=5&t=ten")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe('GET: "/api/reviews/:review_id"', () => {
  test("200: should get review by correct review id", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body: review }) => {
        expect(review).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          review_img_url: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
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

describe("GET: /api/reviews/:review_id/comments", () => {
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
  test("200: should return limit with p query", () => {
    return request(app)
      .get("/api/reviews/2/comments?limit=1&p=1")
      .expect(200)
      .then(({ body: comments }) => {
        expect(comments.comments).toHaveLength(1);
      });
  });
  test("400: limit spelt wrong", () => {
    return request(app)
      .get("/api/reviews/2/comments?lmit&p=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: invalid limit query", () => {
    return request(app)
      .get("/api/reviews/2/comments?limit=ten&p=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: p spelt wrong query", () => {
    return request(app)
      .get("/api/reviews/2/comments?limit=1&t=1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: invalid p query", () => {
    return request(app)
      .get("/api/reviews/2/comments?limit=1&p=one")
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
  test("400: username not found", () => {
    return request(app)
      .post("/api/reviews/4/comments")
      .send({ username: "bakrikhalifa", object: "This game is awesome!" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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
  test("400: incorrect key on req body ", () => {
    return request(app)
      .patch("/api/reviews/3")
      .send({ votes: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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

describe("GET: /api/users", () => {
  test("200: should get all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: users }) => {
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe('DELETE: "/api/comments/:comment_id"', () => {
  test("204: comment deleted succesfully", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: comment id valid but does not exist", () => {
    return request(app)
      .delete("/api/comments/40")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("400: comment id format incorrect", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});

describe(" GET: /api", () => {
  test("200: should receive JSON describing all the available endpoints on the API ", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints.hasOwnProperty("GET /api")).toBe(true);
      });
  });
});

describe("GET: /api/users/:username", () => {
  test("200: should get username", () => {
    return request(app)
      .get("/api/users/mallionaire")
      .expect(200)
      .then(({ body: username }) => {
        expect(username).toMatchObject({
          username: "mallionaire",
          name: "haz",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });

  test("404: correct id format but invalid id", () => {
    return request(app)
      .get("/api/users/bakri")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: incorrect id format", () => {
    return request(app)
      .get("/api/users/900")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH: /api/comments/:comment_id", () => {
  test("200: should return updated comment if req body wants to add", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 2 })
      .expect(200)
      .then(({ body: updatedComment }) => {
        console.log(updatedComment);
        expect(updatedComment).toMatchObject({
          review_id: 1,
          body: expect.any(String),
          votes: 18,
          author: expect.any(String),
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("200: should return updated comment if req body wants to subtract", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -2 })
      .expect(200)
      .then(({ body: updatedComment }) => {
        expect(updatedComment).toMatchObject({
          review_id: 1,
          body: expect.any(String),
          votes: 14,
          author: expect.any(String),
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("404: valid review id format but id does not exist ", () => {
    return request(app)
      .patch("/api/comments/20")
      .send({ inc_votes: 2 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("400: invalid review id format ", () => {
    return request(app)
      .patch("/api/comments/banana")
      .send({ inc_votes: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: incorrect key on req body ", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ votes: 2 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: incorrect value on req body ", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: "Ten" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("POST: /api/reviews", () => {
  test("201: get posted review", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        title: "COD",
        designer: "Bakri Khalifa",
        owner: "mallionaire",
        review_body: "Shooting fun!",
        category: "euro game",
      })
      .expect(201)
      .then(({ body: review }) => {
        expect(review).toMatchObject({
          review_id: expect.any(Number),
          title: expect.any(String),
          category: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        });
      });
  });
  test("400: incorrect keys on req body", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        gameTitle: "COD",
        designer: "Bakri Khalifa",
        owner: "mallionaire",
        review_body: "Shooting fun!",
        category: "euro game",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: missing keys on req body", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        title: "COD",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });

  test("404: username(owner) not found", () => {
    return request(app)
      .post("/api/reviews")
      .send({
        title: "COD",
        designer: "Bakri Khalifa",
        owner: "10",
        review_body: "Shooting fun!",
        category: "euro game",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("POST: /api/categories", () => {
  test.only("201: get posted category", () => {
    return request(app)
      .post("/api/categories")
      .send({
        slug: "FPS game",
        description: "Game involving shooting",
      })
      .expect(201)
      .then(({ body: category }) => {
        console.log(category);
        expect(category).toMatchObject({
          slug: "FPS game",
          description: "Game involving shooting",
        });
      });
  });
  test("400: incorrect keys on req body", () => {
    return request(app)
      .post("/api/categories")
      .send({
        bug: "FPS game",
        description: "Game involving shooting",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("400: missing keys on req body", () => {
    return request(app)
      .post("/api/categories")
      .send({
        description: "Game involving shooting",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe('DELETE: "/api/reviews/:review_id"', () => {
  test("204: review deleted succesfully", () => {
    return request(app)
      .delete("/api/reviews/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("404: comment id valid but does not exist", () => {
    return request(app)
      .delete("/api/reviews/40")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Not Found");
      });
  });
  test("400: comment id format incorrect", () => {
    return request(app)
      .delete("/api/reviews/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad Request");
      });
  });
});
