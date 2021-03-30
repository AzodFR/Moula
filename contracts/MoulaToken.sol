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

    event Approval
    (
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;

    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initSupply) public
    {
        balanceOf[msg.sender] = _initSupply;
        totalSupply = _initSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool)
    {
        require(balanceOf[msg.sender] >= _value, "sender's balance is too low");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool)
    {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool)
    {
        require(balanceOf[_from] >= _value, "sender's balance is too low");

        require(allowance[_from][msg.sender] >= _value, "spender is not allowed to spend this much");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);

        return true;
    }
}