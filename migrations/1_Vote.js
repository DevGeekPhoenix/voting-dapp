const Vote = artifacts.require("Vote");

module.exports = function (deployer) {
  deployer.deploy(Vote, 5260032);
};
