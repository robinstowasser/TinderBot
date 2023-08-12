const { spawn, exec, spawnSync, execSync } = require("child_process");
const { getJobIds } = require("./db");

exports.runJobs = async () => {
  const processJobs = async () => {
    try {
      const jobIds =await getJobIds();
      if (jobIds && jobIds.length > 0) {
        console.log(jobIds.length);

        for (var job of jobIds) {
          const child = spawn("ts-node", ["js/src/runJob.ts", `${job.id}`, `--debug`], {
            shell: true,
            detached: true,
            // stdio: "ignore",
          });
          await sleep(1 * 1000)
        }
        await sleep(60 * 1000);
      } else {
        await sleep(2 * 1000);
      }
    } catch(e) {
      console.log(e)
      await sleep(10 * 1000)
    }
    await processJobs();
  }

  await processJobs();
};

const sleep = async (millis) => {
  return new Promise((resolve) => setTimeout(resolve, millis));
};