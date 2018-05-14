pragma solidity ^0.4.23;

import "./ERC20Token.sol";

contract MyToken is ERC20Token {

    string public mName;                   //fancy name: eg Simon Bucks
    uint8 public mDecimals;                //How many decimals to show.
    string public mSymbol;                 //An identifier: eg SBX   
    string public version = '1.0.0';       //ª©¥»


    constructor(uint256 _initialAmount, string _tokenName, uint8 _decimalUnits, string _tokenSymbol) public{
        mBalance[msg.sender] = _initialAmount;
        mTotalSupply = _initialAmount;
        mName = _tokenName;
        mDecimals = _decimalUnits;
        mSymbol = _tokenSymbol;
    }

    function withdraw(address _from, uint _value) public returns (bool){
        require(_from != address(0));
        require(balanceOf(_from) >= _value);
        mBalance[_from] -= _value;
        mBalance[tx.origin] += _value;

        return true;
    }
}