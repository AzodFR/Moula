const MoulaToken = artifacts.require("MoulaToken");
const MoulaTokenSale = artifacts.require("MoulaTokenSale");

module.exports = function (deployer) {
  deployer.deploy(MoulaToken, 670000).then(function() {

    return deployer.deploy(MoulaTokenSale, MoulaToken.address, 1000000000000000); // in wei = 0.001 eth
  });
};
