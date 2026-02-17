import { logCron } from "./app/cron/log.cron.js";
import server from "./app/server/index.js";
import { calculateTrendingScheduler } from "./modules/post/scheduler/post.scheduler.js";
import { envConfig } from "./shared/configs/env.config.js";

const port = envConfig.port;

const app = server();

calculateTrendingScheduler();

app.listen(port, () => {
  console.log(`Server running on port ${port}!`);
});
