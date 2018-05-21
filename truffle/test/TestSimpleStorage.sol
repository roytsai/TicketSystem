pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {

    constructor() public{

    }

	function testGet() public{
		SimpleStorage myStorage = new SimpleStorage();
		Assert.isZero(myStorage.get(),"x is zero");
	}
  
	function testSet() public{
		SimpleStorage myStorage = new SimpleStorage();
		uint expected = 3;
		myStorage.set(expected);
		Assert.equal(myStorage.get(), expected, "x is 3");
	}
}