import schedule from "node-cron";

export const logCron = () => {
  schedule.schedule("* * * * *", () => {
    console.log("Cron job is running");
  });
};
