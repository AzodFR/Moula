// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MoulaToken
{
    string public name = "Moula";
    string public symbol = "MLA";
    string public standard = "M.0.1";
    uint256 public totalSupply;

    event Transfer
    (
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    constructor(uint256 _initSupply) public
    {
        balanceOf[msg.sender] = _initSupply;
        totalSupply = _initSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool)
    {
        require(balanceOf[msg.sender] >= _value, 'revert: balance too low');

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}