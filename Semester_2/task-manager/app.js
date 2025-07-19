const fs = require("fs");
const path = require("path");
const colors = require("colors");

const filePath = path.join(__dirname, "tasks.json");

//Read Tasks
function readTasks() {
  const data = fs.existsSync("tasks.json")
    ? JSON.parse(fs.readFileSync("tasks.json"))
    : { active: [], archived: [] };
  return data;
}
// Save task
function saveTasks(data) {
  fs.writeFileSync("tasks.json", JSON.stringify(data, null, 2));
}
//write Tasks
function writeTasks(updatedTasks) {
  saveTasks(updatedTasks);
}

// Help function: To show usage of each command
function showHelp() {
  console.log(colors.bold("\n🧠 Task Manager CLI Help Menu"));
  console.log(colors.cyan("Usage:\n"));

  console.log(colors.bold("📌 Core Commands:"));
  console.log(
    "  add <desc> <due>           → Add a new task with optional due date"
  );
  console.log(
    "  bulkadd <desc1> <due1> ... → Add multiple tasks with paired due dates"
  );
  console.log("  list                       → View active tasks");
  console.log("  complete <desc>            → Mark a task as completed");
  console.log("  delete <desc>              → Delete a task by description");

  console.log(colors.bold("\n📁 Archive Commands:"));
  console.log(
    "  archive <desc>             → Archive a completed task by description"
  );
  console.log("  archive view               → View archived tasks");
  console.log("  archive clear all          → Remove all tasks from archive");
  console.log(
    "  archive clear <desc>       → Remove specific task from archive"
  );
  console.log(
    "  archive search <keyword>   → Search archived tasks by keyword"
  );

  console.log(colors.bold("\n🧼 Utility Commands:"));
  console.log("  clear                      → Clear the terminal screen");
  console.log("  help                       → Show this help message");
  console.log("  exit                       → Exit the program\n");
}

// ✅ Add a New Task
function addTask(description, due = null) {
  const data = readTasks();
  const newTask = {
    id: Date.now(),
    description,
    completed: false,
    due,
  };

  data.active.push(newTask); // ✅ Append to active array
  saveTasks(data);
  console.log(colors.green("🆕 Task added!"));
}

// List all Active Tasks
function listTasks() {
  const data = readTasks();
  const active = data?.active ?? [];

  if (active.length === 0) {
    console.log(colors.yellow("📭 No active tasks found."));
    return;
  }
  //Task list headings
  const statusHeader = "Status".padEnd(10);
  const idHeader = "ID".padEnd(20);
  const dueHeader = "Due date".padEnd(20);
  const descHeader = "Description";
  console.log(
    "\n" + colors.bold(statusHeader + idHeader + dueHeader + descHeader)
  );
  console.log(
    colors.gray(
      "────────────────────────────────────────────────────────────────────────────────────────"
    )
  );

  // Task list row
  active.forEach((task) => {
    const rawStatus = task.completed ? "[✔]" : "[ ]";
    const paddedStatus = rawStatus.padEnd(10);
    const paddedId = String(task.id).padEnd(20);
    const paddedDue = task.due ? `🕒 ${task.due}`.padEnd(20) : "".padEnd(20);
    const desc = task.description;
    const coloredStatus = task.completed
      ? colors.green(paddedStatus)
      : colors.red(paddedStatus);
    const coloredDue = colors.gray(paddedDue);
    console.log(`${coloredStatus}${paddedId}${coloredDue}${desc}`);
  });
  console.log(" ");
}

// ✔️ Complete Task
function completeTask(description) {
  const data = readTasks();
  const desc = description.trim().toLowerCase();

  const task = data.active.find((t) => t.description.toLowerCase() === desc);
  if (!task) {
    console.log(colors.yellow("❌ Task not found."));
    return;
  }

  task.completed = true;
  saveTasks(data);
  console.log(colors.green("✔ Task marked as completed."));
}

// 🗑️ Delete Task
function deleteTask(description) {
  const tasks = readTasks();

  const matchTask = (task) =>
    task.description.trim().toLowerCase() === description.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => !matchTask(task));

  if (filteredTasks.length === tasks.length) {
    console.log(colors.red("❌ No task found to delete."));
  } else {
    saveTasks(filteredTasks);
    console.log(colors.red("🗑️ Task deleted."));
  }
}

// 🧠 CLI Controller
const [, , command, ...rest] = process.argv;
const input = rest.join(" ");

switch (command) {
  default:
    console.clear();
    console.log("======================================================================================================");
    console.log(" ████████╗ █████╗ ███████╗██╗  ██╗    ███╗   ███╗ █████╗ ███╗   ██╗ █████╗   ██████╗ ███████╗██████╗  ");
    console.log(" ╚══██╔══╝██╔══██╗██╔════╝██║ ██║     ████╗ ████║██╔══██╗████╗  ██║██╔══██╗ ██╔════╝ ██╔════╝██╔══██╗  ");
    console.log("    ██║   ███████║███████╗█████║      ██╔████╔██║███████║██╔██╗ ██║███████║ ██║  ███╗█████╗  ██████╔╝  ");
    console.log("    ██║   ██╔══██║╚════██║██╔══██║    ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║ ██║   ██║██╔══╝  ██╔═███║  ");
    console.log("    ██║   ██║  ██║███████║██║  ██║    ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║ ╚██████╔╝███████╗██║  ██║  ");
    console.log("    ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝  ");
    console.log("======================================================================================================");

    console.log(
      colors.blue(
        "📘 Usage: add | bulkadd | list | complete <desc> | delete <desc> | archive <desc> | archive view | archive clear <desc> | archive clear all | archive search <keyword> | clear | help | exit"
      )
    );
}

//Interactive mini terminal of the app.js
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt() {
  rl.question(colors.bgMagenta.black("task-manager> "), (command) => {
    const matches = command.match(/"([^"]+)"|\S+/g); // preserves quotes and spaces inside them
    const [cmd, ...args] = matches.map((s) => s.replace(/^"|"$/g, "")); // remove outer quotes
    const input = args.join(" ");

    switch (cmd) {
      case "list":
        listTasks();
        break;
      case "add": {
        if (args.length < 2) {
          console.log(colors.red('❌ Usage: add "<description>" <due-date>'));
          break;
        }

        const due = args.at(-1);
        const desc = args.slice(0, -1).join(" ");

        const data = readTasks();
        const duplicate = data.active.find(
          (task) =>
            task.description.toLowerCase() === desc.toLowerCase() &&
            task.due === due
        );

        if (duplicate) {
          console.log(colors.yellow(`⚠️ "${desc}" (${due}) already exists.`));
          break;
        }

        const newTask = {
          id: Date.now(),
          description: desc,
          completed: false,
          due,
        };

        data.active.push(newTask);
        saveTasks(data);
        console.log(colors.green(`🆕 Added: "${desc}" (${due})`));
        break;
      }
      case "bulkadd": {
        const data = readTasks();
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        for (let i = 0; i < args.length; i++) {
          const desc = args[i];
          const next = args[i + 1];
          const isValidDate = dateRegex.test(next);
          const due = isValidDate ? next : "";

          // Ensure desc is valid (quoted task or standalone text)
          if (!desc || dateRegex.test(desc)) continue;

          const exists = data.active.find(
            (task) =>
              task.description.toLowerCase() === desc.toLowerCase() &&
              task.due === due
          );

          if (exists) {
            console.log(
              colors.yellow(
                `⚠️ "${desc}"${due ? ` (${due})` : ""} already exists. Skipped.`
              )
            );
          } else {
            data.active.push({
              id: Date.now() + i,
              description: desc,
              completed: false,
              due,
            });
            console.log(
              colors.green(`🆕 Added: "${desc}"${due ? ` (${due})` : ""}`)
            );
          }

          if (isValidDate) i++; // Skip the next arg only if it's a date
        }

        saveTasks(data);
        break;
      }

      case "complete":
        completeTask(input);
        break;
      case "delete":
        deleteTask(input);
        break;
      case "exit":
        rl.close();
        return;
      case "clear":
        console.clear();
        console.log(colors.cyan("✨ Welcome back to Task Manager CLI ✨"));
        prompt();
        break;
      case "search": {
        const keyword = input.toLowerCase();
        const { active } = readTasks(); // ✅ extract active tasks array

        const results = active.filter((task) =>
          task.description.toLowerCase().includes(keyword)
        );

        if (results.length === 0) {
          console.log(colors.yellow("🔍 No matching tasks found."));
        } else {
          const statusHeader = "Status".padEnd(10);
          const idHeader = "ID".padEnd(20);
          const dueHeader = "Due date".padEnd(20);
          const descHeader = "Description";
          console.log(
            "\n" + colors.bold(statusHeader + idHeader + dueHeader + descHeader)
          );
          console.log(
            colors.gray(
              "────────────────────────────────────────────────────────────────────────────────────────"
            )
          );

          results.forEach((task) => {
            const status = task.completed ? "[✔]" : "[ ]";
            const paddedStatus = task.completed
              ? colors.green(status.padEnd(10))
              : colors.red(status.padEnd(10));
            const paddedId = String(task.id).padEnd(20);
            const paddedDue = task.due
              ? colors.gray(`🕒 ${task.due}`.padEnd(20))
              : "".padEnd(20);
            console.log(
              `${paddedStatus}${paddedId}${paddedDue}${task.description}`
            );
          });
        }

        break;
      }

      case "help":
        showHelp();
        prompt(); // if you're in REPL mode
        break;

      // Archive Tasks
      case "archive": {
        const subCmd = args[0]?.toLowerCase();

        if (subCmd === "view") {
          // ✅ This block will now trigger properly
          const { archived } = readTasks();

          if (!archived || archived.length === 0) {
            console.log(colors.yellow("📁 Archive is empty."));
            break;
          }

          const statusHeader = "Status".padEnd(10);
          const idHeader = "ID".padEnd(20);
          const dueHeader = "Due date".padEnd(20);
          const descHeader = "Description";
          console.log(
            "\n" + colors.bold(statusHeader + idHeader + dueHeader + descHeader)
          );
          console.log(
            colors.gray(
              "────────────────────────────────────────────────────────────────────────────────────────"
            )
          );

          archived.forEach((task) => {
            const paddedStatus = "[✔]".padEnd(10);
            const paddedId = String(task.id).padEnd(20);
            const paddedDue = task.due
              ? `🕒 ${task.due}`.padEnd(20)
              : "".padEnd(20);
            const desc = task.description;
            console.log(
              `${colors.green(paddedStatus)}${paddedId}${colors.gray(
                paddedDue
              )}${desc}`
            );
          });
          break;
        }
        // Clear all archived tasks
        if (subCmd === "clear" && args[1]?.toLowerCase() === "all") {
          const data = readTasks();
          const count = data.archived.length;
          data.archived = [];
          saveTasks(data);
          console.log(colors.green(`🧼 Cleared ${count} archived task(s).`));
          break;
        }
        // Clear specific archived task by description
        if (subCmd === "clear" && args.length > 1) {
          const desc = args.slice(1).join(" ").toLowerCase();
          const data = readTasks();
          const before = data.archived.length;
          data.archived = data.archived.filter(
            (t) => t.description.toLowerCase() !== desc
          );
          const removed = before - data.archived.length;
          saveTasks(data);
          if (removed > 0) {
            console.log(
              colors.green(
                `🧼 Removed ${removed} task(s) from archive matching: "${desc}"`
              )
            );
          } else {
            console.log(
              colors.yellow(`📁 No archived task found for: "${desc}"`)
            );
          }
          break;
        }
        // Search archived tasks
        if (subCmd === "search" && args.length > 1) {
          const keyword = args.slice(1).join(" ").toLowerCase();
          const { archived } = readTasks();
          const results = archived.filter((task) =>
            task.description.toLowerCase().includes(keyword)
          );

          if (results.length === 0) {
            console.log(colors.yellow("🔍 No matching archived tasks."));
            break;
          }

          const statusHeader = "Status".padEnd(10);
          const idHeader = "ID".padEnd(20);
          const dueHeader = "Due date".padEnd(20);
          const descHeader = "Description";
          console.log(
            "\n" + colors.bold(statusHeader + idHeader + dueHeader + descHeader)
          );
          console.log(
            colors.gray(
              "────────────────────────────────────────────────────────────────────────────────────────"
            )
          );

          results.forEach((task) => {
            const status = task.completed ? "[✔]" : "[ ]";
            const paddedStatus = colors.green(status.padEnd(10));
            const paddedId = String(task.id).padEnd(20);
            const paddedDue = task.due
              ? colors.gray(`🕒 ${task.due}`.padEnd(20))
              : "".padEnd(20);
            console.log(
              `${paddedStatus}${paddedId}${paddedDue}${task.description}`
            );
          });
          break;
        }

        // 🔒 Only archive if not "view"
        const desc = input.toLowerCase();
        const data = readTasks();

        const matchIndex = data.active.findIndex(
          (t) => t.description.toLowerCase() === desc && t.completed
        );

        if (matchIndex === -1) {
          console.log(
            colors.yellow("📦 No matching completed task to archive.")
          );
          break;
        }

        const [archivedTask] = data.active.splice(matchIndex, 1);
        data.archived.push(archivedTask);
        saveTasks(data);

        console.log(colors.green(`🗂 Archived task: ${desc}`));
        break;
      }
      default:
        console.log("🔘 Unknown command.");
    }

    prompt(); // keep looping
  });
}

prompt();
