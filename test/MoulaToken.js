
var MoulaToken = artifacts.require("MoulaToken");

contract('MoulaToken', function(accounts)
{
    var tokenInstance;

    it('check name, symbol, version', function() {
        return MoulaToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, 'Moula', 'check the name');
            return tokenInstance.symbol();
        }).then(function(sym) {
            assert.equal(sym, 'MLA', 'check the symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'M.0.1', 'check the version')
        });
    });

    it('check total creation token', function() {
        return MoulaToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 670000, 'sets the total supply to 67 000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBal) {
            assert.equal(adminBal.toNumber(), 670000, 'check if the creator have it all')
        })
    });

    it('transfer token', function() {
        return MoulaToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 999999);
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer.call(accounts[1], 10000, { from: accounts[0] });
        }).then(function(success) {
            assert.equal(success, true, 'check return boolean');
            return tokenInstance.transfer(accounts[1], 10000, { from: accounts[0] } );
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'chekc the name of Event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'check sender');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'check receiver');
            assert.equal(receipt.logs[0].args._value, 10000, 'check value');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 10000, 'check if transfer worked');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 660000, 'check new owner balance');
        });
    });

})