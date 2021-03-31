// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./MoulaToken.sol";

contract MoulaTokenSale
{
    address admin;
    MoulaToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell
    (
        address indexed _buyer,
        uint256 _amount
    );

    constructor(MoulaToken _tokenContract, uint256 _tokenPrice) public
    {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function mul(uint x, uint y) internal pure returns (uint z)
    {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

    function buyTokens(uint256 _numberOfTokens) public payable
    {
        require(msg.value == mul(_numberOfTokens, tokenPrice), "value not equal to necessary");

        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens, "cannot buy more than available");

        require(tokenContract.transfer(msg.sender, _numberOfTokens), "can't transfer tokens");

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public
    {
        require(msg.sender == admin, "sender must be admin");
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))), "can't transfer tokens");
        msg.sender.transfer(address(this).balance);
    }
}