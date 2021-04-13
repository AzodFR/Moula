const MoulaToken = artifacts.require("MoulaToken");
const MoulaTokenSale = artifacts.require("MoulaTokenSale");

module.exports = function (deployer) {
  var nb_of_tokens = 670000;
  var price = 350000000000000; // in wei = 0.00035 eth
  deployer.deploy(MoulaToken, nb_of_tokens).then(function() {

    return deployer.deploy(MoulaTokenSale, MoulaToken.address, price);
  });
};
