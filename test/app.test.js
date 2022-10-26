const request = require("supertest");
const todos = require("../src/data/todos-data");

const path = require("path");
const app = require(path.resolve(
  `${process.env.SOLUTION_PATH || ""}`,
  "src/app"
));

describe("App", () => {
  beforeEach(() => {
    todos.splice(0, todos.length);
  });

  it("returns error message for a route that is not defined", async () => {
    const response = await request(app).get("/fortnite");
    expect(response.text).toContain("Not found: /fortnite");
  });

  describe("path /todos/:todoId", async () => {
    it("returns error message for non-existent todo", async () => {
      const response = await request(app)
        .get("/todos/100")
        .set("Accept", "application/json");
      expect(response.text).toEqual("Todo id not found: 100");
    });
  });

  describe("path /todos", () => {
    describe("GET method", () => {
      it("returns an array of todos", async () => {
        const expected = [
          {
            id: 1,
            title: "Learn JavaScript",
            completed: true,
          },
          {
            id: 2,
            title: "Learn Node.js",
            completed: false,
          },
        ];

        todos.push(...expected);

        const response = await request(app).get("/todos");

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expected);
      });
    });

    describe("POST method", () => {
      it("creates a new todo and assigns an id", async () => {
        const newTodo = {
          id: 1,
          title: "Take out the trash",
          completed: false,
        };
        const response = await request(app)
          .post("/todos")
          .set("Accept", "application/json")
          .send({ data: newTodo });
        expect(response.status).toEqual(201);
      });

      it("returns 400 if title is missing", async () => {
        const response = await request(app)
          .post("/todos")
          .set("Accept", "application/json")
          .send({ data: { message: "returns 400 if title is missing" } });
        expect(response.status).toEqual(400);
      });

      it("returns 400 if title is empty", async () => {
        const response = await request(app)
          .post("/todos")
          .set("Accept", "application/json")
          .send({ data: { result: "" } });
        expect(response.status).toEqual(400);
      });
    });
  });
});
