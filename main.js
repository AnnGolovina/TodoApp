const input = document.querySelector(".input-todo");
const buttonAdd = document.querySelector(".add-todo");
const todoList = document.querySelector("#todo-list");
const usersOutput = document.querySelector("#users-output");
const clearCurrentUser = document.querySelector("#clear-current-user");
const searchTodo = document.querySelector("#todo-search");
const scrollBtn = document.querySelector("#up-button");
const clearSearchBtn = document.querySelector("#delete-search-btn");

let todos = localStorage.getItem("todos")
  ? JSON.parse(localStorage.getItem("todos"))
  : [];

let users = [];
let currentUser = undefined;

renderToDo(todos);

buttonAdd.onclick = () => {
  const todo = {
    text: input.value,
    done: false,
  };

  input.value = "";

  todos.push(todo);

  renderToDo(todos);
};

function renderToDo(todosToRender) {
  localStorage.setItem("todos", JSON.stringify(todos));

  todoList.innerHTML = "";
  todosToRender.forEach((todo, i) => {
    todoList.innerHTML += `
            <div class="todo ${todo.done && "done"}">
                <div>
                    <span>${i + 1}.</span>
                    <label class="check">
                    <input id="${todo.id}" type="checkbox" ${
      todo.done && "checked"
    } class="todo-checkbox" />   
                    <span tabindex="0"></span>
                   </label>
                    <span>${todo.text}</span>
                </div>
                <button id="${todo.id}" class="delete-todo">Delete</button>
            </div>
        `;
  });

  const checkboxes = [...document.querySelectorAll(".todo-checkbox")];

  checkboxes.forEach((checkbox) => {
    checkbox.onchange = () => {
      const todo = todos.find((todo) => todo.id === +checkbox.id);
      changeTodo(todo.id, !todo.done);
    };
  });

  const deleteButtons = [...document.querySelectorAll(".delete-todo")];

  deleteButtons.forEach((button, i) => {
    button.onclick = () => {
      const todo = todos.find((todo) => todo.id === +button.id);
      //const todo = todos[i];
      deleteBtn(todo.text);
    };
  });
}

function changeTodo(id, newDone) {
  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, done: newDone };
    }
    return todo;
  });

  renderToDo(
    currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos
  );
}

function deleteBtn(text) {
  todos = todos.filter((todo) => todo.text !== text);

  renderToDo(
    currentUser ? todos.filter((todo) => todo.userId === currentUser.id) : todos
  );
}

function searchedTodo(value) {
  const filteredTodos = currentUser
    ? todos.filter(
        (todo) => todo.text.includes(value) && todo.userId === currentUser.id
      )
    : todos.filter((todo) => todo.text.includes(value));

  renderToDo(filteredTodos);
}

function getServerTodos() {
  fetch("https://jsonplaceholder.typicode.com/todos")
    .then((response) => response.json())
    .then((todosFromServer) => {
      const transformTodos = todosFromServer.map((todo) => {
        return {
          text: todo.title,
          done: todo.completed,
          userId: todo.userId,
          id: todo.id,
        };
      });

      todos = transformTodos;
      renderToDo(todos);
    });
}

getServerTodos();

function getServerUsers() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((usersFromServer) => {
      users = usersFromServer;
      renderUsers();
    });
}

getServerUsers();

function renderUsers() {
  usersOutput.innerHTML = "";

  users.forEach((user) => {
    usersOutput.innerHTML += `
    <button class="user-button">${user.name}</button>
    `;
  });

  const userButtons = [...document.querySelectorAll(".user-button")];

  userButtons.forEach((btn, i) => {
    btn.onclick = (event) => {
      searchTodo.value = "";
      currentUser = users[i];
      clearCurrentUser.disabled = false;

      userButtons.forEach((btn) => btn.classList.remove("active-user-btn"));

      event.target.classList.add("active-user-btn");

      const todosOfCurrentUser = todos.filter(
        (todo) => todo.userId === currentUser.id
      );

      console.log(todosOfCurrentUser);
      renderToDo(todosOfCurrentUser);
    };
  });
}

clearCurrentUser.disabled = true;

clearCurrentUser.onclick = () => {
  currentUser = undefined;
  clearCurrentUser.disabled = true;
  const userButtons = [...document.querySelectorAll(".user-button")];
  userButtons.forEach((btn) => btn.classList.remove("active-user-btn"));
  renderToDo(todos);
};

searchTodo.oninput = () => {
  searchedTodo(searchTodo.value);
};

scrollBtn.onclick = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

clearSearchBtn.onclick = () => {
  searchTodo.value = "";
  const todosToRender = currentUser
    ? todos.filter((todo) => todo.userId === currentUser.id)
    : todos;
  renderToDo(todosToRender);
};
