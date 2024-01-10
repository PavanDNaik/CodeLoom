const { mongoose } = require("./connect.js");
const {
  userSchema,
  problemSchema,
  adminSchema,
  aptitudeSchema,
} = require("./schema.js");

const user = mongoose.model("user", userSchema);
const problem = mongoose.model("problems", problemSchema);
const admin_list = mongoose.model("admin_lists", adminSchema);

const Arithmetic = mongoose.model("Arithmetic", aptitudeSchema);
const logicalReasoning = mongoose.model("logicalReasoning", aptitudeSchema);
const verbalReasoning = mongoose.model("verbalReasoning", aptitudeSchema);
const nonVerbalReasoning = mongoose.model("nonVerbalReasoning", aptitudeSchema);
module.exports = {
  user,
  problem,
  admin_list,
  Arithmetic,
  logicalReasoning,
  verbalReasoning,
  nonVerbalReasoning,
};
