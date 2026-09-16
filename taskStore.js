const fs = require('fs');
const path = require('path');

const TASKS_FILE = path.join(process.cwd(), 'tasks.json');

const STATUSES = ['todo', 'in-progress', 'done'];

function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    return [];
  }
  const raw = fs.readFileSync(TASKS_FILE, 'utf8').trim();
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Could not parse ${TASKS_FILE}: ${err.message}`);
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

function nextId(tasks) {
  return tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;
}

function findTask(tasks, id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }
  return task;
}

function addTask(description) {
  const tasks = loadTasks();
  const now = new Date().toISOString();
  const task = {
    id: nextId(tasks),
    description,
    status: 'todo',
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

function updateTask(id, description) {
  const tasks = loadTasks();
  const task = findTask(tasks, id);
  task.description = description;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  return task;
}

function deleteTask(id) {
  const tasks = loadTasks();
  const task = findTask(tasks, id);
  const remaining = tasks.filter((t) => t.id !== id);
  saveTasks(remaining);
  return task;
}

function setStatus(id, status) {
  if (!STATUSES.includes(status)) {
    throw new Error(`Invalid status "${status}". Expected one of: ${STATUSES.join(', ')}`);
  }
  const tasks = loadTasks();
  const task = findTask(tasks, id);
  task.status = status;
  task.updatedAt = new Date().toISOString();
  saveTasks(tasks);
  return task;
}

function listTasks(status) {
  const tasks = loadTasks();
  if (!status) {
    return tasks;
  }
  if (!STATUSES.includes(status)) {
    throw new Error(`Invalid status "${status}". Expected one of: ${STATUSES.join(', ')}`);
  }
  return tasks.filter((t) => t.status === status);
}

module.exports = {
  STATUSES,
  TASKS_FILE,
  loadTasks,
  saveTasks,
  addTask,
  updateTask,
  deleteTask,
  setStatus,
  listTasks,
};
