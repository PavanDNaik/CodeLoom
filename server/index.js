require("dotenv").config();
const BASE_URL = process.env.BASE_URL;
const port = process.env.PORT || 5000;

const { handleCode } = require("./code_exe/codeRunner.js");
const { mongoose, connectToMongo } = require("./db/connect.js");
connectToMongo();

const { updateUsersProgressHistory } = require("./db/user/update.js");
const userRouter = require("./routes/user.js");
const adminRouter = require("./routes/admin.js");
const {
  userAuthOnPostRequest,
  userAuthOnGetRequest,
} = require("./middleware/middleware.js");

const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/admin", adminRouter);

async function fetchTestCode(type, pnum, lang, callback) {
  mongoose
    .model("problems")
    .findOne({
      pnum,
    })
    .select(`${type}.${lang}`)
    .then((problem) => {
      callback(problem[type][lang]);
    })
    .catch((err) => {
      console.log(err);
    });
}

app.post("/run", userAuthOnPostRequest, (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;

  try {
    fetchTestCode("testCode", req.body.pnum, lang, (testCode) => {
      handleCode(lang, code + testCode, (result) => {
        if (result) {
          res.json({ result });
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
    });
  } catch (e) {
    res.json({ error: "unable to fetch test Code" });
  }
});

app.post("/submit", userAuthOnPostRequest, (req, res) => {
  const code = req.body.code;
  const lang = req.body.lang;
  const currentPnum = req.body.pnum;
  const currentUserId = req.body.userId;
  try {
    fetchTestCode("submissionTestCode", req.body.pnum, lang, (testCode) => {
      handleCode(lang, code + testCode, async (result) => {
        if (result) {
          let submissionStatus;
          let isSolved;
          const date = new Date();
          const currentDate = date.toLocaleDateString();

          if (result.substring(0, 4) == "True") {
            submissionStatus = {
              status: "AC",
              lang,
              date: currentDate,
            };
            isSolved = true;
          } else {
            submissionStatus = {
              status: "WA",
              lang,
              date: currentDate,
            };
            isSolved = false;
          }

          const submisonInfo = {
            solved: isSolved,
            lastSubmission: code,
            submissions: [submissionStatus],
          };

          await updateUsersProgressHistory(
            currentUserId,
            String(currentPnum),
            submisonInfo,
            code,
            isSolved,
            submissionStatus
          );
          res.json({ result });
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      });
    });
  } catch {
    res.json({ error: "Internal server Error" });
  }
});

app.post("/submissions", userAuthOnPostRequest, (req, res) => {
  if (!req.body.pnum) {
    res.json([]);
    return;
  }
  mongoose
    .model("user")
    .findById(req.body.userId)
    .select(`problemsReached.${req.body.pnum}`)
    .then((fetchedUser) => {
      if (
        !fetchedUser.problemsReached ||
        !fetchedUser.problemsReached.get(req.body.pnum)
      ) {
        res.json({ msg: "No submission" });
      } else {
        res.json({
          listOfSubmission: fetchedUser.problemsReached.get(req.body.pnum)
            .submissions,
        });
      }
    })
    .catch(() => res.sendStatus(404));
});

app.get("/problems", (req, res) => {
  try {
    mongoose
      .model("problems")
      .find({})
      .select("pnum title difficulty")
      .then((problems) => {
        res.json(problems);
      });
  } catch {
    console.log("error fetching problems");
  }
});

app.get("/problems/:id", userAuthOnGetRequest, (req, res) => {
  const requestedProblemTitle = req.params.id.replaceAll("-", " ");
  mongoose
    .model("problems")
    .findOne({ title: requestedProblemTitle })
    .select("-testCode -submissionTestCode")
    .then((foundp) => {
      if (!foundp) {
        res.status(404).json({ fetchError: "FAILED to FETCH" });
      } else {
        return res.json(foundp);
      }
    })
    .catch(() => {
      res.status(404).json({ fetchError: "cannot find problem" });
    });
});

app.listen(port, () => {
  console.log(`server running on ${BASE_URL}${port}`);
});
