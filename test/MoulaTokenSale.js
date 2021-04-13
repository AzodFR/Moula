var MoulaTokenSale = artifacts.require("MoulaTokenSale");
var MoulaToken = artifacts.require("MoulaToken");

contract('MoulaTokenSale', function(accounts) {

    var tokenSaleInstance;
    var tokenInstance;
    var admin =accounts[0];
    var buyer = accounts[1];
    var tokenPrice = 350000000000000; // wei = 0.0035 eth
    var tokensAvailable = 502500;
    var numberOfTokens = 1;
    var value = numberOfTokens * tokenPrice;

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

    it('token buying', function() {
        return MoulaToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return MoulaTokenSale.deployed()
        }).then(function(instance) {
            tokenSaleInstance = instance;
            return tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'chekc the name of Event');
            assert.equal(receipt.logs[0].args._from, admin, 'check sender');
            assert.equal(receipt.logs[0].args._to, tokenSaleInstance.address, 'check receiver');
            assert.equal(receipt.logs[0].args._value, tokensAvailable, 'check value');
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Sell', 'check the name of Event');
            assert.equal(receipt.logs[0].args._buyer, buyer, 'check buyer');
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'check amount');
            return tokenSaleInstance.tokensSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens, 'increment the amount of tokens sold');
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf("value not equal to necessary") >= 0, 'error message must be emit');
            return tokenSaleInstance.buyTokens(800000, { from: buyer, value: 800000 * tokenPrice })
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('cannot buy more than available') >= 0, 'cannot purchase more tokens than available');
        });
    });

    it('ends token sale', function() {
        return MoulaToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return MoulaTokenSale.deployed()
        }).then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.endSale({ from: buyer})
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('sender must be admin') >= 0, 'sender must be admin');
            return tokenSaleInstance.endSale({ from: admin})
        }).then(function(receipt) {
            return tokenInstance.balanceOf(admin);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 669999, 'returns all unsiold amount');
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(amount) {
            assert.equal(amount.toNumber(), 0, 'token price reset');
        });
    });
});