# Task-Tracker

A simple task tracker, built as described by the [Task Tracker](https://roadmap.sh/projects/task-tracker-js)
roadmap.sh project. Comes in two flavors:

- a command line interface (CLI), written in plain Node.js with no
  external dependencies, storing tasks in a `tasks.json` file
- a small browser app (`index.html`) with the same features, storing
  tasks in the browser's `localStorage` — handy for viewing/managing
  tasks without a terminal, e.g. via GitHub Pages

## CLI usage

```sh
node task-cli.js add "Buy groceries"
node task-cli.js update 1 "Buy groceries and cook dinner"
node task-cli.js delete 1

node task-cli.js mark-in-progress 1
node task-cli.js mark-done 1

node task-cli.js list
node task-cli.js list done
node task-cli.js list todo
node task-cli.js list in-progress
```

Each task has an `id`, `description`, `status`
(`todo` | `in-progress` | `done`), `createdAt` and `updatedAt` timestamp.

### Install as a global command (optional)

```sh
npm link
task-cli add "Buy groceries"
```

## Browser app

Open `index.html` directly in a browser, or serve the repo with any
static file server. Tasks are stored per-browser in `localStorage`, so
CLI tasks and browser tasks are independent of each other.

### Viewing it on GitHub Pages

1. On GitHub, go to **Settings → Pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)` → **Save**
4. After a minute, the app is live at
   `https://reggynald.github.io/Task-Tracker/`
