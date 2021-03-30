var MoulaTokenSale = artifacts.require("MoulaTokenSale");

contract('MoulaTokenSale', function(accounts) {
    var tokenSaleInstance;
    var tokenPrice = 1000000000000000; // wei = 0.001 eth
    it('init contract sale with correct values', function() {
        return MoulaTokenSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has correct address');
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has correct address');
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });
});