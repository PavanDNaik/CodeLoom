const jwt = require("jsonwebtoken");
const { admin_list } = require("../db/model");

const JWT_SECRETE = process.env.JWT_SECRETE;

const userAuthOnPostRequest = (req, res, next) => {
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
};

const userAuthOnGetRequest = async (req, res, next) => {
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
};

const adminAuth = async (req, res, next) => {
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
};

module.exports = { userAuthOnPostRequest, userAuthOnGetRequest, adminAuth };
