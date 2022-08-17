const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command("/knowledge", async ({ command, ack, say }) => {
  try {
    console.log(this)
    console.log(ack);
    await ack();
    console.log("here");
    say("Yaaay! that command works!");
  } catch (error) {
      console.log("err")
    console.error(error);
  }
});

(async () => {
  const port = 3060;

  await app.start(process.env.PORT || port);
  console.log(`Slack bot started on port ${port}`);
})();