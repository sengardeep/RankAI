const { exec } = require("child_process");
const path = require("path");

const npmCommand = "npm";

const runningProcesses = [];

const processes = [
  {
    label: "client",
    command: npmCommand,
    args: ["run", "dev"],
    cwd: path.join(__dirname, "client"),
  },
  {
    label: "server",
    command: npmCommand,
    args: ["run", "server"],
    cwd: path.join(__dirname, "server"),
  },
];

for (const item of processes) {
  const commandLine = `${item.command} ${item.args.join(" ")}`;
  const child = exec(commandLine, {
    cwd: item.cwd,
  });

  if (child.stdout) {
    child.stdout.on("data", (data) => {
      process.stdout.write(`[${item.label}] ${data}`);
    });
  }

  if (child.stderr) {
    child.stderr.on("data", (data) => {
      process.stderr.write(`[${item.label}] ${data}`);
    });
  }

  child.on("error", (error) => {
    console.error(`[${item.label}] failed to start: ${error.message}`);
    shutdown("SIGTERM");
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal || code !== 0) {
      for (const proc of runningProcesses) {
        if (!proc.killed) {
          proc.kill();
        }
      }

      const status = signal ? `signal ${signal}` : `code ${code}`;
      console.error(`[${item.label}] exited with ${status}`);
      process.exit(code ?? 1);
    }
  });

  runningProcesses.push(child);
}

const shutdown = (signal) => {
  for (const proc of runningProcesses) {
    if (!proc.killed) {
      proc.kill(signal);
    }
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));