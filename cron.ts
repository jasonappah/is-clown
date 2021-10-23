const cron = require("node-cron");
import run from "./grades";
console.log("Starting...");

cron.schedule(
	"0 18 * * 5",
	async () => {
		console.log("Fetching grades", new Date());
		await run();
		console.log("Grades should be posted.");
	},
	{ timezone: "America/Chicago" }
);

console.log("Scheduled task.");
