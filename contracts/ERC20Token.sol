pragma solidity ^0.4.23;

import "./ERC20Interface.sol";

contract ERC20Token is ERC20Interface {
    
    uint256 constant private MAX_UINT256 = 2**256 - 1;


    uint public mTotalSupply;
    mapping (address => uint256) public mBalance;
    mapping (address => mapping (address => uint256)) public mAlloweValue;
    
    //代幣發行的總量
    function totalSupply() public view returns (uint){
        return mTotalSupply;
    }
    
    //查詢某帳戶的代幣餘額
    function balanceOf(address _tokenOwner) public view returns (uint balance){
        return mBalance[_tokenOwner];
    }
    
    //移轉代幣給他人
    function transfer(address _to, uint _value) public returns (bool success){
        
        uint256 quota = MAX_UINT256 - mBalance[_to];
        require(mBalance[msg.sender] >= _value);
        require(quota > _value );//預防overflow
        
        mBalance[msg.sender] -= _value;   
        mBalance[_to] += _value;
        emit Transfer(msg.sender, _to, _value); 
        return true;
    }
    
    //批准自己的代幣可以讓(_to)移轉多少出去
    function approve(address _to, uint _value) public returns (bool success){
        mAlloweValue[msg.sender][_to] = _value;
        emit Approval(msg.sender, _to, _value); 
        return true;
    }
    
    //讓被批准的A可以從(_from)移轉被批准的代幣數量(_value)給(_to)
    function transferFrom(address _from, address _to, uint _value) public returns (bool success){
        
        //被授權多少代幣額
        uint256 allowance = mAlloweValue[_from][msg.sender];
        require(_to != address(0));
         //實際_from擁有的代幣額要大於移轉的代幣額
        require(mBalance[_from] >= _value );
        //實際被授權的代幣額要大於欲轉移的代幣額
        require( allowance >= _value );
        
        mBalance[_to] += _value;
        mBalance[_from] -= _value;
        mAlloweValue[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;        
    }
    
    //查詢(_spender)從(_owner)批准可使用的代幣額
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return mAlloweValue[_owner][_spender];
    }
}