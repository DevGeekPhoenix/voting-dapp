const Vote = artifacts.require("Vote");

module.exports = function (deployer) {
  deployer.deploy(Vote, "Vote Contract Has Been Deployed");
};
