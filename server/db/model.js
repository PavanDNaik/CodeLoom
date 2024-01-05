const { mongoose } = require("./connect.js");
const { userSchema, problemSchema, adminSchema } = require("./schema.js");

const user = mongoose.model("user", userSchema);
const problem = mongoose.model("problems", problemSchema);
const admin_list = mongoose.model("admin_lists", adminSchema);

module.exports = { user, problem, admin_list };
