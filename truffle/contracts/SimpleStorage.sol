pragma solidity ^0.4.23;

contract SimpleStorage {
   uint storedData;
   
    constructor() public{

    }
   
   function set(uint x) public {
     storedData = x;
   }
   function get() public constant returns (uint) {
     return storedData;
   }
}