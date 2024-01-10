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
//  const structure = {
//    Arithmetic: {
//      Percentage: [Object],
//      Average: [Object],
//      "Problems on Trains": [Object],
//      "Time and Distance": [Object],
//      "Time and Work": [Object],
//    },
//    "Logical Reasonsing": {
//      "Number Series": [Object],
//      "Letter and Symbol Series": [Object],
//      Analogies: [Object],
//      "Logical Problems": [Object],
//    },
//    "Verbal Reasonsing": {
//      Syllogism: [Object],
//      "Blood Relation Test": [Object],
//      "Series Completion": [Object],
//      "Seating Arrangement": [Object],
//    },
//  };
const aptitudeSchema = new mongoose.Schema({
  catagoryName: String,
  quetion: Object,
});

module.exports = { userSchema, problemSchema, adminSchema, aptitudeSchema };
