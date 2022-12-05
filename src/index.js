const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;
  const user = users.find(user => user.username === username);

  if(user === undefined) {
    return response.status(400).json({ error: "User not found" });
  }
  request.user = user;
  next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username }= request.body;
  const existUser = users.some((user) => user.username === username);
  if(existUser) {
    return response.status(400).json({error: "username already exists"})
  }
  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(user)
  response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;
  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  response.status(201).json(todo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  if(user.todos.length === 0){
    response.status(404).json({error: "Not found todo"})
  }

  user.todos.forEach(todo => {
    if(todo.id === id) {
      todo.title = title;
      todo.deadline = new Date(deadline);
        return response.status(200).json(todo)
    } 
  })
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  user.todos.forEach((todo) => {
    if(todo.id === id){
      todo.done = !todo.done;
      response.status(200).json(todo)
    } 
  })
  response.status(404).json({error: 'Todo not found'})
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;  
  const { user } = request
  const existeId = user.todos.some((todo) => todo.id === id);
  console.log(existeId);
  if(!existeId) return response.status(404).json({ error: "todo not found"})
  user.todos.forEach((todo, index) => {
    if(todo.id === id){
      user.todos.splice(index, 1)
    }
  })
  response.status(204).send()
});

module.exports = app;