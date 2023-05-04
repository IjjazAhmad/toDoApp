// ---------------------- time function ------------- 
window.onload = () => {
  setInterval(() => {
    const currentTime = dayjs().format('dddd-MMMM-DD-YYYY hh:mm:ss');
    document.getElementById("time").innerHTML = currentTime;
  }, 1000); // update every second
  greeding();
  showtodo();
  showTask()
  document.getElementById("EditTask").style.display = "none"
}

// ----------------------------------------Globle Function -------------------
// 1 --------------------------- notifyfunction -------------
var error = "#bc3908";
var success = "linear-gradient(to right, #00b09b, #96c93d)";
var alert = "#faa307";
const notify = (msg , color) => {
  Toastify({
    text: msg,
    duration: 3000,
    destination: "",
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: color,
    },

  }).showToast();
}

// 2 ----------------------- get value function -----
const getFieldValue = id => document.getElementById(id).value;
// 3 ----------------------- getRandomId --------
const getRandomId = () => {
  return Math.floor((1 + Math.random()) * 10000);
}
// 4 ------------------- set new value in localstorage -----------
const setTodosInLocalStorage = (newtodos) => {
  localStorage.setItem("todos", JSON.stringify(newtodos));
}

// 5 ---------------------- set value in field ----------------
const setValue = (id, value) => {
  return document.getElementById(id).value = value
}

// 6 -------------------- clear field value 
const emptyFieldValues = () => {
  document.getElementById("title").value = "";
  document.getElementById("location").value = "";
  document.getElementById("message").value = "";
}

// 7 -------------------- showoutput -----------------
const showTaskTable = (table) => {
  document.getElementById("taskTable").innerHTML = table
}



// --------------------- greeding -----------------
const greeding = () => {
  let name = prompt("Enter Your Name:");
  document.getElementById("greeding").innerHTML = name;
}
const showtodo = () => {
  document.getElementById("showtodo").style.display = "block";

}

// ---------------------- add user function --------------
const handleSubmit = () => {
  event.preventDefault();
  let title = getFieldValue("title"), location = getFieldValue("location"), message = getFieldValue("message");
  title = title.trim();
  location = location.trim();
  message = message.trim();

  if (title.length < 3) {
    return notify("Please enter your title correctly", "error");
  }
  if (location.length < 3) {
    return notify("Please enter your location correctly", "error");
  }
  if (message.length < 10) {
    return notify("Please enter minimum 10 words in message", "error");
  }
  let todo = { title, location, message }

  todo.id = getRandomId();
  todo.dateCreated = new Date().getTime();
  todo.status = "active";
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(todo);
  // localStorage.setItem("todo" , JSON.stringify(todos));
  setTodosInLocalStorage(todos)
  notify("A new todo has been sucessfully added", "sucess");
  showTask();
  emptyFieldValues();
}
// ----------------------------- show task function ----------------

function showTask() {
  // clearOutput();
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  if (!todos.length) {
    notify("No task available. Add a task button to add your task" , "alert");
    showTaskTable('<h5 class="text-center m-5">HURRAY! No task available. Add a task button to add your task.</h5>');
    return;
  }
  let tablestartingcode = '<table class="table table-responsive">'
  let tableendingcode = '</table>'
  let tableHead = '<thead><th scope="col">#</th><th scope="col">Title</th><th scope="col">Location</th><th scope="col">Message</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>'
  let tableBody = '';
  for (let i = 0; i < todos.length; i++) {
    let todo = todos[i];
    tableBody += `<tr><th scope="row">${i + 1}</th><td>${todo.title}</td><td>${todo.location}</td><td>${todo.message}</td><td>${todo.status}</td><td><button type="button" class="btn btn-info " data-value=${todo.id} onclick="editToDo(event)">Edit</button><button type="button" class="btn btn-danger ms-2" data-value=${todo.id} onclick="deleteToDo(event)">Delete</button></td></tr>`
  }
  let table = tablestartingcode + tableHead + "<tbody>" + tableBody + "<tbody>" + tableendingcode;
  showTaskTable(table);
}



// ------------------------ delete task function ----------------

const deleteToDo = (event) => {
  let todoid = event.target.getAttribute("data-value");
  const todos = JSON.parse(localStorage.getItem("todos"));
  let todosAfterDelete = todos.filter((todo) => {
    return todo.id != todoid;
  })
  localStorage.setItem("todos", JSON.stringify(todosAfterDelete));
  notify("Sucessfully deleted" , "alert")
  showTask();
}


// -------------------- edit task -----------
const editToDo = (event) => {
  let todoId = event.target.getAttribute('data-value')
  // console.log(todoId)
  const todos = JSON.parse(localStorage.getItem("todos"))
  let todo = todos.find((todo) => {
    return todo.id === todoId
  })

  const { title, location, message } = todo || {}
  setValue("title", title || "")
  setValue("location", location || "")
  setValue("message", message || "")

  localStorage.setItem("todoEdited", JSON.stringify(todo))
  showTask();
  document.getElementById("addTask").style.display = "none"
  document.getElementById("EditTask").style.display = "inline-block"
}


const handleEdit = () => {
  event.preventDefault();
  const todoEdited = JSON.parse(localStorage.getItem("todoEdited"))
  let updatedTitle = inputField("title")
  let updatelocation = inputField("location")
  let updatedDescription = inputField("description")

  const updated = { ...todoEdited, title: updatedTitle, location: updatelocation, description: updatedDescription }
  updated.dateCreated = new Date().getTime()

  const todos = JSON.parse(localStorage.getItem("todos"))
  const updatedTodos = todos.map(todo => {
    if (todo.id === updated.id) {
      return updated;
    }
    return todo;
  });
  localStorage.setItem("todos", JSON.stringify(updatedTodos))
  notify("A new todo has been sucessfully edit", "sucess");
  showTask();
  emptyFieldValues();
  document.getElementById("addTask").style.display = "inline-block"
  document.getElementById("updateTask").style.display = "none"
}