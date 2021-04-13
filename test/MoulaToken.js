
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
            assert.equal(totalSupply.toNumber(), 670000, 'sets the total supply to 670 000');
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
            assert(error.message.indexOf("sender's balance is too low") >= 0, 'error message must be emit');
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

    it('approves token for delegated transfer', function() {
        return MoulaToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success) {
            assert.equal(success, true, 'check return value');
            return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'chekc the name of Event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'check owner');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'check spender');
            assert.equal(receipt.logs[0].args._value, 100, 'check value');
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 100, 'store the allowance for delegated transfer');
        });
    });

    it('handles delegated transfers', function() {
        return MoulaToken.deployed().then(function(instance) {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
        }).then(function(receipt) {
            return tokenInstance.approve(spendingAccount, 15, { from: fromAccount});
        }).then(function(receipt) {
            return tokenInstance.transferFrom(fromAccount, toAccount, 500, { from: spendingAccount });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf("sender's balance is too low") >= 0, 'can\'t send more than balance');
            return tokenInstance.transferFrom(fromAccount, toAccount, 50, { from: spendingAccount });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf("spender is not allowed to spend this much") >= 0, 'can\'t spend this much');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(success) {
            assert.equal(success, true, 'goo transfer from');
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'chekc the name of Event');
            assert.equal(receipt.logs[0].args._from, fromAccount, 'check sender');
            assert.equal(receipt.logs[0].args._to, toAccount, 'check receiver');
            assert.equal(receipt.logs[0].args._value, 10, 'check value');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(from) {
            assert.equal(from, 90, 'check new from balance');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(to) {
            assert.equal(to, 10, 'check new to balance');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance) {
            assert.equal(allowance, 5, 'check updated allowance');
        });
    });
})