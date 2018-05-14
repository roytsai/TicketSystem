pragma solidity ^0.4.23;

import "./ERC20Interface.sol";

contract ERC20Token is ERC20Interface {
    
    uint256 constant private MAX_UINT256 = 2**256 - 1;


    uint public mTotalSupply;
    mapping (address => uint256) public mBalance;
    mapping (address => mapping (address => uint256)) public mAlloweValue;
    
    //�N���o�檺�`�q
    function totalSupply() public view returns (uint){
        return mTotalSupply;
    }
    
    //�d�߬Y�b�᪺�N���l�B
    function balanceOf(address _tokenOwner) public view returns (uint balance){
        return mBalance[_tokenOwner];
    }
    
    //����N�����L�H
    function transfer(address _to, uint _value) public returns (bool success){
        
        uint256 quota = MAX_UINT256 - mBalance[_to];
        require(mBalance[msg.sender] >= _value);
        require(quota > _value );//�w��overflow
        
        mBalance[msg.sender] -= _value;   
        mBalance[_to] += _value;
        emit Transfer(msg.sender, _to, _value); 
        return true;
    }
    
    //���ۤv���N���i�H��(_to)����h�֥X�h
    function approve(address _to, uint _value) public returns (bool success){
        mAlloweValue[msg.sender][_to] = _value;
        emit Approval(msg.sender, _to, _value); 
        return true;
    }
    
    //���Q��㪺A�i�H�q(_from)����Q��㪺�N���ƶq(_value)��(_to)
    function transferFrom(address _from, address _to, uint _value) public returns (bool success){
        
        //�Q���v�h�֥N���B
        uint256 allowance = mAlloweValue[_from][msg.sender];
        require(_to != address(0));
         //���_from�֦����N���B�n�j���઺�N���B
        require(mBalance[_from] >= _value );
        //��ڳQ���v���N���B�n�j����ಾ���N���B
        require( allowance >= _value );
        
        mBalance[_to] += _value;
        mBalance[_from] -= _value;
        mAlloweValue[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;        
    }
    
    //�d��(_spender)�q(_owner)���i�ϥΪ��N���B
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return mAlloweValue[_owner][_spender];
    }
}