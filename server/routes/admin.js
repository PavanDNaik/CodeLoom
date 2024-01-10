const router = require("express").Router();
const JWT_SECRETE = process.env.JWT_SECRETE;
const JWT_ADMIN_SECRETE = process.env.JWT_ADMIN_SECRETE;
const { user, problem, admin_list } = require("../db/model");
const {
  userAuthOnGetRequest,
  adminAuth,
  userAuthOnPostRequest,
} = require("../middleware/middleware");

router.get("/", (req, res) => {
  res.send("hi");
});

router.post("/addProblem", (req, res) => {
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

router.get(
  "/:adminName/:adminEmail/admin-exists",
  userAuthOnGetRequest,
  adminAuth,
  async (req, res) => {
    return res.json({ exists: true });
  }
);

router.post(
  "/:adminName/:adminEmail/login",
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
module.exports = router;
