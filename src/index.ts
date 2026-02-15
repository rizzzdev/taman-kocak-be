import { logCron } from "./app/cron/log.cron.js";
import server from "./app/server/index.js";
import { envConfig } from "./shared/configs/env.config.js";

const port = envConfig.port;

const app = server();

logCron();

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
