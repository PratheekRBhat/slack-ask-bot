const { App } = require("@slack/bolt");
const { error } = require("console");
const fs = require("fs");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

let faqs = JSON.parse(fs.readFileSync("db.json"));

app.command("/eng-faq", async ({ command, ack, say }) => {
  try {
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

app.command("/eng-update", async ({command, ack, say}) => {
  try {
    await ack();
    const data = command.text.split("|");
    const newFAQ = {
      keyword: data[0],
      question: data[1],
      answer: data[2],
    }

    fs.readFile("db.json", function(err, data) {
      const json = JSON.parse(data);
      json.data.push(newFAQ);
      fs.writeFile("db.json", JSON.stringify(json), function(err) {
        if (err) throw err;
        console.log("Successfully written to db.json");
      });
    });
    say(`You've added a new FAQ with keyword ${newFAQ.keyword}`);
  } catch (error) {
    console.log("err");
    console.error(error);
  }
});

app.message(/hey/, async({ message, say }) => {
  try {
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
})();