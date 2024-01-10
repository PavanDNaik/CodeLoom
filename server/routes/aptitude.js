const router = require("express").Router();
const jwt = require("jsonwebtoken");
const JWT_SECRETE = process.env.JWT_SECRETE;
const {
  Arithmetic,
  logicalReasoning,
  verbalReasoning,
  nonVerbalReasoning,
} = require("../db/model");

function getModule(type) {
  switch (type) {
    case "arithmetic":
      return Arithmetic;
    case "logicalReasoning":
      return logicalReasoning;
    case "verbalReasoning":
      return verbalReasoning;
    case "nonVerbalReasoning":
      return nonVerbalReasoning;
  }
}
// router.get("/aptitude/base-structure",(req,res)=>{
//     aptitude.find({}).select("")
// })
router.post("/getQuestions", async (req, res) => {
  const { type, catagory } = req.body;
  const aptitudeModel = getModule(type);
  try {
    const questions = await aptitudeModel.find({ catagoryName: catagory });
    if (!questions) {
      res.send({});
    } else {
      res.send({ questions });
    }
  } catch (e) {
    console.log(e);
    res.send({ fetchError: "Server Error" });
  }
});

router.post("/addQuestion", async (req, res) => {
  const { type, catogary } = req.query;
  const quetion = req.body;
  const aptitudeModel = getModule(type);
  if (!aptitudeModel) {
    return res.send({ fetchError: "invalid Type" });
  }
  try {
    await aptitudeModel.create({
      catagoryName: catogary,
      quetion,
    });
  } catch (e) {
    res.send({ fetchError: e });
  }
  res.send({ success: true });
});

module.exports = router;
