const MoulaToken = artifacts.require("MoulaToken");

module.exports = function (deployer) {
  deployer.deploy(MoulaToken);
};
