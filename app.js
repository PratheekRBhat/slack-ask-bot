const { App } = require("@slack/bolt");
const fs = require("fs");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

let faqs = JSON.parse(fs.readFileSync("db.json"));

app.command("/knowledge", async ({ command, ack, say }) => {
  try {
    console.log(command)
    await ack();
    let message = { blocks: [] };
    faqs.data.map((faq) => {
      message.blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Question*",
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: faq.question,
          }
        },
        {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Answer*",
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: faq.answer,
            }
          }
      );
    });
    say(message);
  } catch (error) {
    console.log("err")
    console.error(error);
  }
});

app.message(/hey/, async({ message, say }) => {
  try {
    console.log(message)
    say(`Hey there ${message.user}!`);
  } catch(error) {
    console.log("err");
    console.error(error);
  }
});

app.message(/products/, async({ message, say }) => {
  try {
    let message = { blocks: [] };
    const productsFAQ = faqs.data.filter((faq) => faq.keyword === "products");
    productsFAQ.map(faq => {
      message.blocks.push(
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Question*"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: faq.question
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Answer*"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: faq.answer
          }
        }
      );
    });
    say(message);
  } catch(error) {
    console.log("err");
    console.error(error);
  }
});

(async () => {
  const port = 3060;

  await app.start(process.env.PORT || port);
  console.log(`Slack bot started on port ${port}`);
})();