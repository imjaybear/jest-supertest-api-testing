const express = require("express");
const app = express();

const path = require("path");
const todos = require(path.resolve("src/data/todos-data"));

app.use(express.json());

app.get("/todos/:todoId", (req, res, next) => {
  const todoId = Number(req.params.todoId);
  const foundTodo = todos.find((todo) => todo.id === todoId);
  if (foundTodo) {
    res.json({ data: foundTodo });
  } else {
    next(`Todo id not found: ${req.params.todoId}`);
  }
});

app.get("/todos", (req, res) => {
  res.json({ data: todos });
});

let lastTodoId = todos.reduce((maxId, todo) => Math.max(maxId, todo.id), 0);

app.post("/todos", (req, res) => {
  const { data: { title, completed } = {} } = req.body;
  if (title) {
    const newTodo = {
      id: ++lastTodoId, // Increment last id then assign as the current ID
      title,
      completed,
    };
    todos.push(newTodo);
    res.status(201).json({ data: newTodo });
  } else {
    res.sendStatus(400);
  }
});

// Not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

// Error handler
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).send(error);
});

module.exports = app;
