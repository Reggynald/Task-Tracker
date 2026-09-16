const STORAGE_KEY = 'task-tracker-tasks';
const STATUS_LABELS = {
  todo: 'Todo',
  'in-progress': 'In Bearbeitung',
  done: 'Erledigt',
};

const form = document.getElementById('add-form');
const input = document.getElementById('description-input');
const list = document.getElementById('task-list');
const emptyState = document.getElementById('empty-state');
const filters = document.getElementById('filters');

let activeFilter = 'all';

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function nextId(tasks) {
  return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
}

function addTask(description) {
  const tasks = loadTasks();
  const now = new Date().toISOString();
  tasks.push({
    id: nextId(tasks),
    description,
    status: 'todo',
    createdAt: now,
    updatedAt: now,
  });
  saveTasks(tasks);
}

function setStatus(id, status) {
  const tasks = loadTasks();
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
}

function deleteTask(id) {
  const tasks = loadTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
}

function render() {
  const tasks = loadTasks();
  const visible = activeFilter === 'all' ? tasks : tasks.filter((t) => t.status === activeFilter);

  list.innerHTML = '';
  emptyState.hidden = visible.length > 0;

  visible
    .slice()
    .sort((a, b) => a.id - b.id)
    .forEach((task) => {
      const li = document.createElement('li');
      li.className = `task-item ${task.status}`;

      const statusBadge = document.createElement('span');
      statusBadge.className = `task-status ${task.status}`;
      statusBadge.textContent = STATUS_LABELS[task.status];

      const description = document.createElement('span');
      description.className = 'task-description';
      description.textContent = task.description;

      const actions = document.createElement('div');
      actions.className = 'task-actions';

      if (task.status !== 'in-progress') {
        const inProgressBtn = document.createElement('button');
        inProgressBtn.textContent = 'In Bearbeitung';
        inProgressBtn.addEventListener('click', () => {
          setStatus(task.id, 'in-progress');
          render();
        });
        actions.appendChild(inProgressBtn);
      }

      if (task.status !== 'done') {
        const doneBtn = document.createElement('button');
        doneBtn.textContent = 'Erledigt';
        doneBtn.addEventListener('click', () => {
          setStatus(task.id, 'done');
          render();
        });
        actions.appendChild(doneBtn);
      }

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Löschen';
      deleteBtn.className = 'delete';
      deleteBtn.addEventListener('click', () => {
        deleteTask(task.id);
        render();
      });
      actions.appendChild(deleteBtn);

      li.append(statusBadge, description, actions);
      list.appendChild(li);
    });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const description = input.value.trim();
  if (!description) return;
  addTask(description);
  input.value = '';
  render();
});

filters.addEventListener('click', (event) => {
  const button = event.target.closest('.filter-btn');
  if (!button) return;
  activeFilter = button.dataset.status;
  filters.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.toggle('active', btn === button));
  render();
});

render();
