const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
  const port = 3060;

  await app.start(process.env.PORT || port);
  console.log(`Slack bot started on port ${port}`);
})();