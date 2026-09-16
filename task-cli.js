#!/usr/bin/env node

const store = require('./taskStore');

function printUsage() {
  console.log(`Usage: task-cli <command> [arguments]

Commands:
  add <description>              Add a new task
  update <id> <description>      Update a task's description
  delete <id>                    Delete a task
  mark-in-progress <id>          Mark a task as in-progress
  mark-done <id>                 Mark a task as done
  list [status]                  List tasks, optionally filtered by
                                  status: todo | in-progress | done`);
}

function formatTask(task) {
  return `#${task.id} [${task.status}] ${task.description}`;
}

function requireId(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid task id "${raw}"`);
  }
  return id;
}

function main(argv) {
  const [command, ...args] = argv;

  switch (command) {
    case 'add': {
      const description = args.join(' ').trim();
      if (!description) {
        throw new Error('Please provide a task description: task-cli add "<description>"');
      }
      const task = store.addTask(description);
      console.log(`Task added successfully (ID: ${task.id})`);
      break;
    }

    case 'update': {
      const [rawId, ...rest] = args;
      const description = rest.join(' ').trim();
      if (!description) {
        throw new Error('Please provide a new description: task-cli update <id> "<description>"');
      }
      const task = store.updateTask(requireId(rawId), description);
      console.log(`Task ${task.id} updated successfully`);
      break;
    }

    case 'delete': {
      const [rawId] = args;
      const task = store.deleteTask(requireId(rawId));
      console.log(`Task ${task.id} deleted successfully`);
      break;
    }

    case 'mark-in-progress': {
      const [rawId] = args;
      const task = store.setStatus(requireId(rawId), 'in-progress');
      console.log(`Task ${task.id} marked as in-progress`);
      break;
    }

    case 'mark-done': {
      const [rawId] = args;
      const task = store.setStatus(requireId(rawId), 'done');
      console.log(`Task ${task.id} marked as done`);
      break;
    }

    case 'list': {
      const [status] = args;
      const tasks = store.listTasks(status);
      if (tasks.length === 0) {
        console.log(status ? `No tasks with status "${status}"` : 'No tasks found');
        break;
      }
      tasks.forEach((task) => console.log(formatTask(task)));
      break;
    }

    case undefined:
    case 'help':
    case '-h':
    case '--help':
      printUsage();
      break;

    default:
      console.error(`Unknown command: ${command}`);
      printUsage();
      process.exitCode = 1;
  }
}

try {
  main(process.argv.slice(2));
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exitCode = 1;
}
