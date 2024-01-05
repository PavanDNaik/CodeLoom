require("dotenv").config();
const BASE_URL = process.env.BASE_URL;
const port = process.env.PORT || 5000;
const JWT_SECRETE = process.env.JWT_SECRETE;
const JWT_ADMIN_SECRETE = process.env.JWT_ADMIN_SECRETE;

const { handleCode } = require("./code_exe/codeRunner.js");
const { mongoose, connectToMongo } = require("./db/connect.js");
const { user, problem, admin_list } = require("./db/model.js");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

connectToMongo();
const app = express();
app.use(express.json());
app.use(cors());

async function updateUsersProgressHistory(
  currentUserId,
  currentPnum,
  submisonInfo,
  latestCode,
  isSolved,
  submissionStatus
) {
  await mongoose
    .model("user")
    .findById(currentUserId)
    .then((currentUser) => {
      if (!currentUser) {
        return;
      } else if (!currentUser.problemsReached) {
        currentUser.problemsReached = new Map();
        currentUser.problemsReached.set(currentPnum, submisonInfo);
      } else if (!currentUser.problemsReached.get(currentPnum)) {
        currentUser.problemsReached.set(currentPnum, submisonInfo);
      } else {
        const previousHistory = currentUser.problemsReached.get(currentPnum);
        previousHistory.solved |= isSolved;
        previousHistory.lastSubmission = latestCode;
        previousHistory.submissions.push(submissionStatus);

        currentUser.problemsReached.set(currentPnum, previousHistory);
      }
      currentUser.save().catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

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

function userAuthOnPostRequest(req, res, next) {
  if (!req.headers.token) {
    return res.json({ fetchError: "Token Required!" });
  }
  try {
    const userId = jwt.verify(req.headers.token, JWT_SECRETE);
    if (!userId) {
      return res.status(401).json({ fetchError: "Invalid Token" });
    } else {
      req.body.userId = userId.user.id;
      next();
    }
  } catch {
    return res.status(401).json({ fetchError: "Invalid Token" });
  }
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

app.post("/sign-up", async (req, res) => {
  userName = req.body.name;
  userEmail = req.body.email;
  userPassword = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(userPassword, salt);
  const someUser = await user.findOne({ userEmail: userEmail });
  if (someUser) {
    res.json({ errors: "Account already exists" });
    return;
  } else {
    const newUser = new user({
      userName,
      userEmail,
      userPassword: encryptedPassword,
    });
    newUser
      .save()
      .then((someUser) => {
        const dataForJwtSign = {
          user: {
            id: someUser._id.toString(),
          },
        };
        const authToken = jwt.sign(dataForJwtSign, JWT_SECRETE);
        return res.json({
          token: authToken,
          userName: someUser.userName,
          route: "/home",
        });
      })
      .catch((errors) => {
        console.log("errors");
        res.status(404).json({ errors });
      });
  }
});

app.post("/log-in", async (req, res) => {
  userEmail = req.body.email;
  userPassword = req.body.password;
  const someUser = await user.findOne({ userEmail });
  if (someUser) {
    const pwdCompare = await bcrypt.compare(
      userPassword,
      someUser.userPassword
    );
    if (pwdCompare) {
      const dataForJwtSign = {
        user: {
          id: someUser._id,
        },
      };
      const authToken = jwt.sign(dataForJwtSign, JWT_SECRETE);
      return res.json({
        token: authToken,
        userName: someUser.userName,
        route: "/home",
      });
    } else {
      res.json({ errors: "Invalid Credentials!!" });
      return;
    }
  } else {
    res.json({ errors: "Invalid Credentials!!" });
  }
});

async function userAuthOnGetRequest(req, res, next) {
  if (!req.headers.token) {
    return res.status(401).send({ fetchError: "Token Required" });
  } else {
    try {
      const userID = jwt.verify(req.headers.token, JWT_SECRETE);

      if (!userID) {
        return res.status(401).json({ fetchError: "Invalid Token" });
      }
    } catch {
      return res.status(401).json({ fetchError: "Invalid Token" });
    }
  }

  next();
}

app.post("/admin/addProblem", (req, res) => {
  const newProblem = new problem({
    ...req.body.newProblem,
  });
  newProblem
    .save()
    .then(() => {
      console.log("New Problem Added!");
      res.json({ success: "problem added" });
    })
    .catch(() => {
      console.log("Could not Add problem!");
    });
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

async function adminAuth(req, res, next) {
  const adminName = req.params.adminName;
  const adminEmail = req.params.adminEmail;
  const adminFromList = await admin_list.findOne({
    name: adminName,
    email: adminEmail,
  });
  if (!adminFromList) {
    return res.json({ exists: false });
  }
  next();
}
app.get(
  "/admin/:adminName/:adminEmail/admin-exists",
  userAuthOnGetRequest,
  adminAuth,
  async (req, res) => {
    return res.json({ exists: true });
  }
);

app.post(
  "/admin/:adminName/:adminEmail/login",
  userAuthOnPostRequest,
  adminAuth,
  async (req, res) => {
    const userId = req.body.userId;
    const userAccountInfo = await mongoose
      .model("user")
      .findById(userId)
      .select("userPassword");
    if (!userAccountInfo) {
      return res.json({ fetchError: "please login to user Account" });
    }
    const passwordMatched = await bcrypt.compare(
      req.body.password,
      userAccountInfo.userPassword
    );

    if (passwordMatched) {
      const adminData = {
        user: {
          email: req.params.adminEmail,
        },
      };
      const adminToken = jwt.sign(adminData, JWT_ADMIN_SECRETE);
      return res.json({ adminAuthToken: adminToken });
    } else {
      return res.json({ fetchError: "Wrong Password" });
    }
  }
);

app.listen(port, () => {
  console.log(`${BASE_URL}${port}`);
});
