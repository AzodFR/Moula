
var MoulaToken = artifacts.require("MoulaToken");

contract('MoulaToken', function(accounts)
{
    it('check total creation token', function() {
        return MoulaToken.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 67000, 'sets the total supply to 67 000');
        });
    });
})