const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const cors = require("cors");
app.use(cors());
const port = 3000;
app.listen(port, () => console.log("listening at port 3000"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

app.post("/api", (req, res) => {
  // console.log(req.body.Value);
  let search = req.body.Value;
  console.log(`In backend  ${search}`);
  (async () => {
    try {
      // const browser = await puppeteer.launch({ headless: false });
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://www.google.com/");
      await page.type("[aria-label='Search']", search, { delay: 100 });
      await page.evaluate(() => {
        document.querySelector(".aajZCb").style.display = "none";
        document.querySelector(".gNO89b").click();
      });
      await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 0 });
      await page.click(".wwB5gf");
      await page.click(".wwB5gf");
      await page.evaluate(() => {
        let dropDownbtn = document.querySelectorAll(".wwB5gf");
        if (dropDownbtn.length) {
          document.querySelector(".wwB5gf").click();
          document.querySelector(".wwB5gf").click();
          dropDownbtn.forEach((a) => {
            a.click();
          });
          //test@2
          dropDownbtn.forEach((a) => {
            a.click();
          });
          dropDownbtn.forEach((a) => {
            a.click();
          });
          dropDownbtn.forEach((a) => {
            a.click();
          });
          //test@2
        }
      });

      await page.click(".wwB5gf");
      await page.click(".wwB5gf");

      const grabData = await page.evaluate(async () => {
        const data = [];
        let Main_Des_First = document.querySelector(".kno-rdesc span");
        let Main_Des_Second = document.querySelector(".V3FYCf .hgKElc");
        let search_Q = document.querySelector("[aria-label='Search']");

        if (Main_Des_First != null) {
          data.push({
            Question: search_Q.value,
            Answer: Main_Des_First.textContent
          });
        } else if (Main_Des_Second != null) {
          data.push({
            Question: search_Q.value,
            Answer: Main_Des_Second.textContent
          });
        }

        let Answers = document.querySelectorAll(".hgKElc");
        if (Answers.length) {
          for (let i = 0; i < Answers.length; i++) {
            let Question =
              Answers[i].parentElement.parentElement.parentElement.parentElement
                .parentElement.parentElement.parentElement
                .previousElementSibling.textContent;
            data.push({
              Question: Question,
              Answer: Answers[i].textContent,
              id: i + 1
            });
          }
        } else {
          data.push({
            Question: "No Question on Google first page",
            Answer: "No Answer on Google first page",
            id: null
          });
        }
        return data;
      });
      if (grabData.length) {
        console.log(grabData);
        res.json({
          status: "SUCCESS",
          QnA: grabData
        });
      }
      await browser.close();
    } catch (error) {
      res.json({
        status: "FAILED",
        errorMessage: error.message
      });
    }
  })();
});
