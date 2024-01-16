const bcrypt = require("bcryptjs");
const { user } = require("../db/model");
const jwt = require("jsonwebtoken");
const JWT_SECRETE = process.env.JWT_SECRETE;

const router = require("express").Router();
router.get("/", (req, res) => {
  res.send("hi");
});

router.post("/sign-up", async (req, res) => {
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

router.post("/log-in", async (req, res) => {
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

router.post("/getSolvedQuestions", (req, res) => {});

module.exports = router;
