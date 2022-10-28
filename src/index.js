const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid')

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const userExists = users.find((user)=> user.username === username )

  if(!userExists){
    return response.status(400).send({error: "User not exists!"})
  }

  request.user = userExists

  next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).send(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const user  = request.user

  console.log(user)

  return response.status(200).json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const  user  = request.user

  const{ title, deadline } = request.body

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline + " 00:00"),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).send(todo)
  
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const  user  = request.user
  const { id } = request.params
  const{ title, deadline } = request.body

 const todo = user.todos.find((todo)=> todo.id === id)

 todo.title = title
 todo.deadline = deadline

 return response.status(200).send(todo)

})

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const  user  = request.user
  const { id } = request.params

 const todo = user.todos.find((todo)=> todo.id === id)

 todo.done = true

 return response.status(200).send(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const user  = request.user
  const { id } = request.params

 const todo = user.todos.find((todo)=> todo.id === id)

 user.todos.splice(todo, 1)

 return response.status(200).send()
});

module.exports = app;