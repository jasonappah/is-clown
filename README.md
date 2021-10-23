# is-clown
Slack bot that sends my grades to a public channel. Currently running on [fly.io](https://fly.io). 

## Notable stuff
- `grades.ts` exports the function that actually gets the grades. It uses Puppeteer to login to my gradebooks as me since neither system has a public API that I have access to, takes a screenshot, then sends them to Slack.
- `adhoc.ts` runs the function once and terminates, used for testing
- `cron.ts` is a long-lived process that runs the function every Friday at 6pm my time using `node-cron`.
- `ws.ts` runs a simple web server and also schedules the cron job since Fly seems to require some sort of web server to be running if you don't want your VM to be terminated.
