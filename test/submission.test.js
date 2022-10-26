const request = require("supertest");
const todos = require("../src/data/todos-data");

const fs = require("fs");
const path = require("path");
const app = require(path.resolve(
  `${process.env.SOLUTION_PATH || ""}`,
  "src/app"
));

describe("App", () => {
  beforeEach(() => {
    todos.splice(0, todos.length);
  });
  
  it("returns error message for non-existent route", async () => {
    const response = await request(app)
      .get("/physics")
      .set("Accept", "application/json");

    expect(response.text).toContain("Not found: /physics");
  });

  describe("path /todos/:todoId", async () => {
    it("returns error message for non-existent todo", async () => {
      const response = await request(app)
        .get("/todos/99")
        .set("Accept", "application/json");

      expect(response.text).toContain("Todo id not found: 99");
    });
  });

  describe("path /todos", () => {
    describe("GET method", () => {
      it("returns an array of todos", async () => {
        const expected = [
          {
            id: 1,
            title: "Learn JavaScript",
            completed: true
          },
          {
            id: 2,
            title: "Learn Node.js",
            completed: false
          }
        ];

        todos.push(...expected);

        const response = await request(app).get("/todos");

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(expected);
      });
    });
    describe("POST method", () => {
      it("creates a new todo and assigns an id", async () => {
        const response = await request(app)
          .post("/todos")
          .set("Accept", "application/json")
          .send({ data: { title: "creates a new todo and assigns id", completed: false } });

        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeGreaterThanOrEqual(1);
        expect(response.body.data.title).toEqual(
          "creates a new todo and assigns id"
        );
        expect(response.body.data.completed).toBeFalsy();
      });

      it("returns 400 if title is missing", async () => {
        const response = await request(app)
          .post("/todos")
          .set("Accept", "application/json")
          .send({ data: { message: "returns 400 if text is missing", completed: true } });

        expect(response.status).toBe(400);
      });

      it("returns 400 if title is empty", async () => {
        const response = await request(app)
          .post("/todos")
          .set("Accept", "application/json")
          .send({ data: { title: "" } });

        expect(response.status).toBe(400);
      });
    });
  });
});

describe("app.test.js", () => {
  const solutionTestsFilePath = path.join(__dirname, "app.test.js");
  const solutionTestContent = fs.readFileSync(solutionTestsFilePath, "utf-8");
  
  it("should use the expect syntax", () => {
    expect(solutionTestContent).toContain("expect");
  });

  it("should use the describe syntax", () => {
    expect(solutionTestContent).toContain("describe");
  });

});
