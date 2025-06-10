const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const { spawn } = require("node:child_process");

async function print(filePath, split) {
  let COMMAND = `lp -d PRINTER ${filePath} -o ${split ? "PageSize=w288h432-div2" : "PageSize=w288h432"} -o StpLaminate=Matte`;
  try {
    parentPort.postMessage({
      status: "start",
      message: "Printing worker starts",
      response: null,
    });

    const process = spawn("bash", ["-c", COMMAND]);

    process.on("error", (err) => {
      parentPort.postMessage({
        status: "error",
        message: err.message,
        response: null,
      });
    });
  } catch (error) {
    throw error;
  }
}

print(workerData.filePath, workerData.split);
