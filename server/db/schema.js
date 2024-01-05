const { mongoose } = require("./connect");

const userSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
  problemsReached: {
    type: Map,
    of: {
      lastSubmission: String,
      solved: Boolean,
      submissions: Array,
    },
  },
});

const problemSchema = new mongoose.Schema({
  pnum: Number,
  title: String,
  difficulty: String,
  description: {
    overview: String,
    examples: Array,
  },
  boilerPlate: {
    python: String,
    java: String,
    c: String,
    cpp: String,
  },
  testCode: {
    python: String,
    java: String,
    c: String,
    cpp: String,
  },
  submissionTestCode: {
    python: String,
    java: String,
    c: String,
    cpp: String,
  },
  testCases: Array,
});

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = { userSchema, problemSchema, adminSchema };
