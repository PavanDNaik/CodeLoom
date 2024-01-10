const { mongoose } = require("../connect");
const updateUsersProgressHistory = async (
  currentUserId,
  currentPnum,
  submisonInfo,
  latestCode,
  isSolved,
  submissionStatus
) => {
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
  // try {
  //   await user.updateOne(
  //     { _id: currentUserId },
  //     {
  //       $up: {
  //         problemsReached: {
  //           [currentPnum]: {
  //             latestCode,
  //             solved: isSolved,
  //             $push: {
  //               submissions: submissionStatus,
  //             },
  //           },
  //         },
  //       },
  //     }
  //   );
  // } catch (e) {
  //   console.log(e);
  // }
};

module.exports = { updateUsersProgressHistory };
