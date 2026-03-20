
let tasks = [];
let statusFilter = "all";
let tagFilter = "all";


const form = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const tagInput = document.getElementById("tag-input");
const errorMessage = document.getElementById("error-message");
const taskList = document.getElementById("task-list");
const counter = document.getElementById("task-counter");
const tagFilterSelect = document.getElementById("tag-filter");


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}


form.addEventListener("submit", function (e) {
  e.preventDefault();

  const text = taskInput.value.trim();
  const tag = tagInput.value.trim();

  // Validation
  if (text === "") {
    errorMessage.textContent = "Task name is required.";
    return;
  }

  errorMessage.textContent = "";

  const newTask = {
    id: Date.now(),
    text: text,
    tag: tag,
    done: false,
  };

  tasks.push(newTask);

  saveTasks();
  renderTasks();

  form.reset();
});


function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !task.done) ||
      (statusFilter === "completed" && task.done);

    const matchesTag =
      tagFilter === "all" || task.tag === tagFilter;

    return matchesStatus && matchesTag;
  });

  filtered.forEach((task) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${task.text} (${task.tag || "no tag"})`;

    if (task.done) span.classList.add("completed");

    // Toggle complete
    span.addEventListener("click", () => toggleTask(task.id));

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTask(task.id);

    li.appendChild(span);
    li.appendChild(delBtn);

    taskList.appendChild(li);
  });

  updateCounter();
  updateTagFilterOptions();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );

  saveTasks();
  renderTasks();
}


function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}


function updateCounter() {
  const active = tasks.filter((t) => !t.done).length;
  counter.textContent = `${active} active task${active !== 1 ? "s" : ""}`;
}


function updateTagFilterOptions() {
  const tags = [
    ...new Set(tasks.map((t) => t.tag).filter((t) => t !== "")),
  ];

  tagFilterSelect.innerHTML =
    `<option value="all">All Tags</option>`;

  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilterSelect.appendChild(option);
  });
}


document
  .querySelectorAll("#status-filters button")
  .forEach((btn) => {
    btn.addEventListener("click", () => {
      statusFilter = btn.dataset.filter;
      renderTasks();
    });
  });

tagFilterSelect.addEventListener("change", (e) => {
  tagFilter = e.target.value;
  renderTasks();
});


loadTasks();
renderTasks();
